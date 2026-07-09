import { useState, useRef, useEffect } from "react";
import {
  Camera, ChevronRight, Shield, Monitor, Smartphone,
  AlertTriangle, X, Eye, EyeOff, CheckCircle, Lock, LogOut,
} from "lucide-react";
import type { AuthUser } from "../../App";

function maskPhone(p: string) {
  return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

type PwdStep = "verify" | "newpwd" | "done";

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

export function AccountSettings({ user, onLogout }: Props) {
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdStep, setPwdStep] = useState<PwdStep>("verify");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Password change state
  const [verifyCode, setVerifyCode] = useState("");
  const [vcCountdown, setVcCountdown] = useState(0);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function startCountdown() {
    setVcCountdown(60);
    timerRef.current = setInterval(() => {
      setVcCountdown((v) => {
        if (v <= 1) { clearInterval(timerRef.current!); return 0; }
        return v - 1;
      });
    }, 1000);
  }

  function openPwdModal() {
    setPwdStep("verify");
    setVerifyCode(""); setNewPwd(""); setConfirmPwd(""); setPwdError(""); setVcCountdown(0);
    setShowPwdModal(true);
  }

  function handleVerifyNext() {
    if (verifyCode.length !== 6) { setPwdError("请输入6位验证码"); return; }
    setPwdError(""); setPwdStep("newpwd");
  }

  function handlePwdConfirm() {
    if (newPwd.length < 8) { setPwdError("密码不能少于8位"); return; }
    if (newPwd !== confirmPwd) { setPwdError("两次密码不一致"); return; }
    setPwdError(""); setPwdStep("done");
  }

  const DEVICES = [
    { name: "Windows · Chrome", isCurrent: true, lastLogin: "刚刚", icon: Monitor },
    { name: "iPhone", isCurrent: false, lastLogin: "昨天 20:13", icon: Smartphone },
  ];

  const PRIVACY_ITEMS = ["用户协议", "隐私政策", "账号使用规则"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">账号设置</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          管理你的账号资料、登录方式和安全设置。
        </p>
      </div>

      {/* ── Basic Info ── */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">基本资料</h2>
        </div>
        <div className="divide-y divide-border">
          {/* Avatar */}
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7c6dfa] text-xl font-bold text-white">
                  {user.phone.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
                  <Camera size={10} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">头像</p>
                <p className="text-xs text-muted-foreground">支持 JPG、PNG 格式</p>
              </div>
            </div>
            <button className="text-sm text-[#7c6dfa] hover:underline">修改头像</button>
          </div>

          {/* Nickname */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">昵称</p>
              <p className="mt-0.5 text-sm text-muted-foreground">TaoX创作者</p>
            </div>
            <button className="text-sm text-[#7c6dfa] hover:underline">编辑</button>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">绑定手机号</p>
              <p className="mt-0.5 font-mono text-sm text-muted-foreground">{maskPhone(user.phone)}</p>
            </div>
            <button className="text-sm text-[#7c6dfa] hover:underline">更换手机号</button>
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">账号安全</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7c6dfa]/10">
                <Shield size={15} className="text-[#7c6dfa]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">登录密码</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                    <CheckCircle size={9} />已设置
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">建议定期修改密码，保护账号安全。</p>
              </div>
            </div>
            <button
              onClick={openPwdModal}
              className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-foreground"
            >
              修改密码
            </button>
          </div>
        </div>
      </section>

      {/* ── Devices ── */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">登录设备</h2>
          <button className="text-xs text-red-500/70 hover:text-red-500 transition-colors">退出其他设备</button>
        </div>
        <div className="divide-y divide-border">
          {DEVICES.map((d) => (
            <div key={d.name} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <d.icon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                  {d.isCurrent && (
                    <span className="rounded-full border border-[#7c6dfa]/20 bg-[#7c6dfa]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#7c6dfa]">
                      当前设备
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">最近登录：{d.lastLogin}</p>
              </div>
              {!d.isCurrent && (
                <button className="shrink-0 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                  退出
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-secondary/40 px-6 py-3">
          <p className="text-xs text-muted-foreground">多设备管理功能即将上线，敬请期待。</p>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">隐私与协议</h2>
        </div>
        <div className="divide-y divide-border">
          {PRIVACY_ITEMS.map((item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between px-6 py-4 text-sm text-foreground transition-colors hover:bg-secondary/50"
            >
              <span>{item}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* ── Danger Zone ── */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">危险操作</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">退出当前账号</p>
              <p className="mt-0.5 text-xs text-muted-foreground">退出后需重新登录</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-red-500/30 hover:text-red-500"
            >
              <LogOut size={13} />
              退出登录
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground/50">注销账号</p>
              <p className="mt-0.5 text-xs text-muted-foreground/40">注销后数据无法恢复，此操作不可撤销</p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl border border-border/50 px-4 py-2 text-sm font-medium text-muted-foreground/40 transition-all hover:border-red-500/20 hover:text-red-500/60"
            >
              注销账号
            </button>
          </div>
        </div>
      </section>

      {/* ── Password Change Modal ── */}
      {showPwdModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPwdModal(false)}
          />
          <div
            className="relative z-10 w-full max-w-[400px] rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Step indicator */}
            {pwdStep !== "done" && (
              <div className="flex items-center gap-2 border-b border-border px-8 py-4">
                {(["verify", "newpwd"] as PwdStep[]).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      s === pwdStep ? "bg-[#7c6dfa] text-white" :
                      (i < ["verify","newpwd"].indexOf(pwdStep) ? "bg-[#7c6dfa]/20 text-[#7c6dfa]" : "bg-secondary text-muted-foreground")
                    }`}>
                      {i + 1}
                    </div>
                    {i === 0 && <div className={`h-px w-8 ${pwdStep === "newpwd" ? "bg-[#7c6dfa]/30" : "bg-border"}`} />}
                  </div>
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {pwdStep === "verify" ? "验证身份" : "设置新密码"}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowPwdModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X size={15} />
            </button>

            <div className="p-8">
              {pwdStep === "verify" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">安全验证</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      验证绑定手机号{" "}
                      <span className="font-mono font-medium text-foreground">{maskPhone(user.phone)}</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="请输入短信验证码"
                      value={verifyCode}
                      onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setPwdError(""); }}
                      className="flex-1 rounded-xl border border-border bg-secondary py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60 focus:ring-1 focus:ring-[#7c6dfa]/20"
                    />
                    <button
                      onClick={startCountdown}
                      disabled={vcCountdown > 0}
                      className="shrink-0 rounded-xl border border-border bg-secondary px-3 py-3 text-xs font-medium text-muted-foreground hover:border-[#7c6dfa]/30 hover:text-[#7c6dfa] disabled:opacity-50 whitespace-nowrap transition-all"
                    >
                      {vcCountdown > 0 ? `${vcCountdown}s` : "获取验证码"}
                    </button>
                  </div>
                  {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
                  <button onClick={handleVerifyNext} className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all">
                    下一步
                  </button>
                </div>
              )}

              {pwdStep === "newpwd" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">设置新密码</h3>
                    <p className="mt-1 text-xs text-muted-foreground">密码长度 8-20 位，建议包含字母和数字</p>
                  </div>
                  {[
                    { label: "新密码", val: newPwd, set: setNewPwd, show: showNewPwd, setShow: setShowNewPwd, ph: "请输入新密码" },
                    { label: "确认新密码", val: confirmPwd, set: setConfirmPwd, show: showConfirmPwd, setShow: setShowConfirmPwd, ph: "请再次输入新密码" },
                  ].map((f) => (
                    <div key={f.label} className="relative">
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock size={14} />
                      </div>
                      <input
                        type={f.show ? "text" : "password"}
                        placeholder={f.ph}
                        value={f.val}
                        onChange={(e) => { f.set(e.target.value); setPwdError(""); }}
                        className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60"
                      />
                      <button
                        type="button"
                        onClick={() => f.setShow((v: boolean) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {f.show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  ))}
                  {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
                  <button onClick={handlePwdConfirm} className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all">
                    确认修改
                  </button>
                </div>
              )}

              {pwdStep === "done" && (
                <div className="flex flex-col items-center py-2 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">密码修改成功</h3>
                  <p className="mt-2 mb-7 text-sm text-muted-foreground">请使用新密码重新登录</p>
                  <button
                    onClick={() => { setShowPwdModal(false); onLogout(); }}
                    className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all"
                  >
                    重新登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Account Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div
            className="relative z-10 w-full max-w-[380px] rounded-2xl border border-border bg-card shadow-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X size={15} />
            </button>
            <div className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">确认注销账号？</h3>
            <p className="mt-2 mb-7 text-sm leading-relaxed text-muted-foreground">
              注销后账号数据将永久删除，无法恢复。<br />此操作不可撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                取消
              </button>
              <button className="flex-1 rounded-xl border border-red-500/25 bg-red-500/8 py-3 text-sm font-medium text-red-500 hover:bg-red-500/14 transition-all">
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
