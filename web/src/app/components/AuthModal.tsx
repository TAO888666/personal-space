import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff, Phone, Lock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import type { AuthUser } from "../App";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

type AuthTab = "sms" | "password";
type ForgotStep = "phone" | "newpwd" | "done";
type ModalView = "login" | "forgot";

function maskPhone(phone: string) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function isValidPhone(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone);
}

async function requestJson<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "请求失败，请稍后再试");
  }

  return data as T;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<ModalView>("login");
  const [tab, setTab] = useState<AuthTab>("sms");

  // SMS login state
  const [smsPhone, setSmsPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [smsCodeSent, setSmsCodeSent] = useState(false);
  const [smsError, setSmsError] = useState("");
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsSending, setSmsSending] = useState(false);

  // Password login state
  const [pwdPhone, setPwdPhone] = useState("");
  const [pwdPass, setPwdPass] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>("phone");
  const [fgPhone, setFgPhone] = useState("");
  const [fgCode, setFgCode] = useState("");
  const [fgCountdown, setFgCountdown] = useState(0);
  const [fgNewPwd, setFgNewPwd] = useState("");
  const [fgConfirmPwd, setFgConfirmPwd] = useState("");
  const [showFgPwd, setShowFgPwd] = useState(false);
  const [showFgConfirm, setShowFgConfirm] = useState(false);
  const [fgError, setFgError] = useState("");
  const [fgSending, setFgSending] = useState(false);
  const [fgLoading, setFgLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fgTimerRef.current) clearInterval(fgTimerRef.current);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function startCountdown(setter: (n: number) => void, ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) {
    setter(60);
    ref.current = setInterval(() => {
      setter((v) => {
        if (v <= 1) { clearInterval(ref.current!); return 0; }
        return v - 1;
      });
    }, 1000);
  }

  async function handleSendSmsCode() {
    if (!isValidPhone(smsPhone)) { setSmsError("手机号格式不正确"); return; }
    setSmsError("");
    setSmsSending(true);
    try {
      await requestJson("/api/auth/send-code", { phone: smsPhone, purpose: "login" });
      setSmsCodeSent(true);
      startCountdown(setSmsCountdown, timerRef);
    } catch (error) {
      setSmsError(error instanceof Error ? error.message : "验证码发送失败，请稍后再试");
    } finally {
      setSmsSending(false);
    }
  }

  async function handleSmsLogin() {
    if (!isValidPhone(smsPhone)) { setSmsError("手机号格式不正确"); return; }
    if (smsCode.length !== 6) { setSmsError("请输入6位验证码"); return; }
    setSmsError("");
    setSmsLoading(true);
    try {
      const data = await requestJson<{ user: AuthUser }>("/api/auth/sms-login", {
        phone: smsPhone,
        code: smsCode,
      });
      onSuccess(data.user);
    } catch (error) {
      setSmsError(error instanceof Error ? error.message : "登录失败，请稍后再试");
    } finally {
      setSmsLoading(false);
    }
  }

  async function handlePwdLogin() {
    if (!isValidPhone(pwdPhone)) { setPwdError("手机号格式不正确"); return; }
    if (pwdPass.length < 6) { setPwdError("密码不能少于6位"); return; }
    setPwdError("");
    setPwdLoading(true);
    try {
      const data = await requestJson<{ user: AuthUser }>("/api/auth/password-login", {
        phone: pwdPhone,
        password: pwdPass,
      });
      onSuccess(data.user);
    } catch (error) {
      setPwdError(error instanceof Error ? error.message : "登录失败，请稍后再试");
    } finally {
      setPwdLoading(false);
    }
  }

  async function handleFgSendCode() {
    if (!isValidPhone(fgPhone)) { setFgError("手机号格式不正确"); return; }
    setFgError("");
    setFgSending(true);
    try {
      await requestJson("/api/auth/send-code", { phone: fgPhone, purpose: "reset_password" });
      startCountdown(setFgCountdown, fgTimerRef);
    } catch (error) {
      setFgError(error instanceof Error ? error.message : "验证码发送失败，请稍后再试");
    } finally {
      setFgSending(false);
    }
  }

  function handleFgNext() {
    if (!isValidPhone(fgPhone)) { setFgError("手机号格式不正确"); return; }
    if (fgCode.length !== 6) { setFgError("请输入6位验证码"); return; }
    setFgError("");
    setForgotStep("newpwd");
  }

  async function handleFgConfirm() {
    if (fgNewPwd.length < 8) { setFgError("密码长度不能少于8位"); return; }
    if (fgNewPwd !== fgConfirmPwd) { setFgError("两次输入的密码不一致"); return; }
    setFgError("");
    setFgLoading(true);
    try {
      await requestJson("/api/auth/reset-password", {
        phone: fgPhone,
        code: fgCode,
        password: fgNewPwd,
      });
      setForgotStep("done");
    } catch (error) {
      setFgError(error instanceof Error ? error.message : "密码重置失败，请稍后再试");
    } finally {
      setFgLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={16} />
        </button>

        {view === "login" ? (
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">欢迎回来</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                登录后即可使用更多 AI 工具和会员专属功能
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex rounded-xl border border-border bg-secondary p-1">
              {([["sms", "验证码登录"], ["password", "密码登录"]] as [AuthTab, string][]).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setSmsError(""); setPwdError(""); }}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    tab === t
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "sms" ? (
              <div className="space-y-4">
                {/* Phone */}
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Phone size={15} />
                    <span className="text-sm border-r border-border pr-2">+86</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    value={smsPhone}
                    onChange={(e) => { setSmsPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setSmsError(""); }}
                    className={`w-full rounded-xl border py-3 pl-[88px] pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all bg-secondary ${
                      smsError.includes("手机号") ? "border-red-500/60 focus:border-red-500/80" : "border-border focus:border-[#7c6dfa]/60 focus:ring-1 focus:ring-[#7c6dfa]/20"
                    }`}
                  />
                </div>

                {/* Code */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={smsCode}
                    onChange={(e) => { setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setSmsError(""); }}
                    className={`flex-1 rounded-xl border py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all bg-secondary ${
                      smsError.includes("验证码") ? "border-red-500/60" : "border-border focus:border-[#7c6dfa]/60 focus:ring-1 focus:ring-[#7c6dfa]/20"
                    }`}
                  />
                  <button
                    onClick={handleSendSmsCode}
                    disabled={smsCountdown > 0 || !smsPhone || smsSending}
                    className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/40 hover:text-[#7c6dfa] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {smsSending ? "发送中..." : smsCountdown > 0 ? `重新获取 ${smsCountdown}s` : "获取验证码"}
                  </button>
                </div>

                {smsCodeSent && smsCountdown > 0 && (
                  <p className="text-xs text-[#7c6dfa]">验证码已发送至 {maskPhone(smsPhone)}，请注意查收</p>
                )}

                {smsError && <p className="text-xs text-red-500">{smsError}</p>}

                <button
                  onClick={handleSmsLogin}
                  disabled={smsLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_20px_rgba(124,109,250,0.35)] disabled:opacity-60"
                >
                  {smsLoading ? <><Loader2 size={15} className="animate-spin" />登录中...</> : "登录 / 注册"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Phone */}
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Phone size={15} />
                    <span className="text-sm border-r border-border pr-2">+86</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    value={pwdPhone}
                    onChange={(e) => { setPwdPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setPwdError(""); }}
                    className={`w-full rounded-xl border py-3 pl-[88px] pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all bg-secondary ${
                      pwdError.includes("手机号") ? "border-red-500/60" : "border-border focus:border-[#7c6dfa]/60 focus:ring-1 focus:ring-[#7c6dfa]/20"
                    }`}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="请输入密码"
                    value={pwdPass}
                    onChange={(e) => { setPwdPass(e.target.value); setPwdError(""); }}
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all bg-secondary ${
                      pwdError ? "border-red-500/60" : "border-border focus:border-[#7c6dfa]/60 focus:ring-1 focus:ring-[#7c6dfa]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Options row */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border accent-[#7c6dfa]"
                    />
                    <span className="text-xs text-muted-foreground">记住登录状态</span>
                  </label>
                  <button
                    onClick={() => { setView("forgot"); setForgotStep("phone"); setFgError(""); }}
                    className="text-xs text-[#7c6dfa] hover:underline"
                  >
                    忘记密码？
                  </button>
                </div>

                {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}

                <button
                  onClick={handlePwdLogin}
                  disabled={pwdLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] hover:shadow-[0_0_20px_rgba(124,109,250,0.35)] disabled:opacity-60"
                >
                  {pwdLoading ? <><Loader2 size={15} className="animate-spin" />登录中...</> : "登录"}
                </button>
              </div>
            )}

            {/* Agreement */}
            <p className="mt-5 text-center text-xs text-muted-foreground">
              登录即代表同意
              <button className="text-[#7c6dfa] hover:underline mx-0.5">《用户协议》</button>
              和
              <button className="text-[#7c6dfa] hover:underline mx-0.5">《隐私政策》</button>
            </p>
          </div>
        ) : (
          /* Forgot Password View */
          <div className="p-8">
            {/* Back + header */}
            <div className="mb-6">
              <button
                onClick={() => setView("login")}
                className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> 返回登录
              </button>

              {forgotStep !== "done" && (
                <>
                  <h2 className="text-2xl font-semibold text-foreground">找回密码</h2>
                  {/* Step indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    {(["phone", "newpwd", "done"] as ForgotStep[]).map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all ${
                          forgotStep === s ? "bg-[#7c6dfa] text-white" :
                          (i < ["phone","newpwd","done"].indexOf(forgotStep) ? "bg-[#7c6dfa]/20 text-[#7c6dfa]" : "bg-secondary text-muted-foreground")
                        }`}>
                          {i + 1}
                        </div>
                        {i < 2 && <div className={`h-px w-8 ${i < ["phone","newpwd","done"].indexOf(forgotStep) ? "bg-[#7c6dfa]/40" : "bg-border"}`} />}
                      </div>
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {forgotStep === "phone" ? "验证手机号" : "设置新密码"}
                    </span>
                  </div>
                </>
              )}
            </div>

            {forgotStep === "phone" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">请输入注册时使用的手机号，我们将发送验证码进行身份验证</p>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Phone size={15} />
                    <span className="text-sm border-r border-border pr-2">+86</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    value={fgPhone}
                    onChange={(e) => { setFgPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setFgError(""); }}
                    className="w-full rounded-xl border border-border bg-secondary py-3 pl-[88px] pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60 focus:ring-1 focus:ring-[#7c6dfa]/20"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={fgCode}
                    onChange={(e) => { setFgCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setFgError(""); }}
                    className="flex-1 rounded-xl border border-border bg-secondary py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60"
                  />
                  <button
                    onClick={handleFgSendCode}
                    disabled={fgCountdown > 0 || !fgPhone || fgSending}
                    className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-muted-foreground hover:border-[#7c6dfa]/40 hover:text-[#7c6dfa] disabled:opacity-50 whitespace-nowrap"
                  >
                    {fgSending ? "发送中..." : fgCountdown > 0 ? `${fgCountdown}s` : "获取验证码"}
                  </button>
                </div>
                {fgError && <p className="text-xs text-red-500">{fgError}</p>}
                <button
                  onClick={handleFgNext}
                  className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all"
                >
                  下一步
                </button>
              </div>
            )}

            {forgotStep === "newpwd" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">设置新密码</h2>
                <p className="text-xs text-muted-foreground">密码长度 8-20 位，建议包含字母和数字</p>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showFgPwd ? "text" : "password"}
                    placeholder="请输入新密码"
                    value={fgNewPwd}
                    onChange={(e) => { setFgNewPwd(e.target.value); setFgError(""); }}
                    className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60"
                  />
                  <button type="button" onClick={() => setShowFgPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showFgPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showFgConfirm ? "text" : "password"}
                    placeholder="请再次输入新密码"
                    value={fgConfirmPwd}
                    onChange={(e) => { setFgConfirmPwd(e.target.value); setFgError(""); }}
                    className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60"
                  />
                  <button type="button" onClick={() => setShowFgConfirm(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showFgConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fgError && <p className="text-xs text-red-500">{fgError}</p>}
                <button
                  onClick={handleFgConfirm}
                  disabled={fgLoading}
                  className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all"
                >
                  {fgLoading ? "提交中..." : "确认修改"}
                </button>
              </div>
            )}

            {forgotStep === "done" && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12">
                  <CheckCircle size={36} className="text-emerald-500" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-foreground">密码修改成功</h2>
                <p className="mb-8 text-sm text-muted-foreground">请使用新密码重新登录</p>
                <button
                  onClick={() => { setView("login"); setTab("password"); setForgotStep("phone"); }}
                  className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all"
                >
                  返回登录
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
