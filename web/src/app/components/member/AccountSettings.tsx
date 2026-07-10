import { useEffect, useRef, useState } from "react";
import {
  Camera, ChevronRight, Shield, Monitor, Smartphone,
  AlertTriangle, X, Eye, EyeOff, CheckCircle, Lock, LogOut,
} from "lucide-react";
import type { AuthUser } from "../../App";
import { UserAvatar } from "../UserAvatar";

function maskPhone(p: string) {
  return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

function getDisplayName(user: AuthUser) {
  return user.nickname?.trim() || "TaoX创作者";
}

function getAvatarText(user: AuthUser) {
  return (user.nickname?.trim() || user.phone).charAt(0).toUpperCase();
}

async function readJson(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "操作失败，请稍后再试");
  }

  return data as { user: AuthUser };
}

const AVATAR_COLORS = ["#7c6dfa", "#2563eb", "#0891b2", "#059669", "#d97706", "#e11d48"];
const DEVICES = [
  { name: "Windows · Chrome", isCurrent: true, lastLogin: "刚刚", icon: Monitor },
  { name: "iPhone", isCurrent: false, lastLogin: "昨天 20:13", icon: Smartphone },
];
const PRIVACY_ITEMS = ["用户协议", "隐私政策", "账号使用规则"];

interface Props {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
  onLogout: () => void;
}

export function AccountSettings({ user, onUserUpdate, onLogout }: Props) {
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [nickname, setNickname] = useState(user.nickname || "");
  const [avatarColor, setAvatarColor] = useState(user.avatarColor || "#7c6dfa");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(user.avatarUrl || "");
  const [verifyCode, setVerifyCode] = useState("");
  const [vcCountdown, setVcCountdown] = useState(0);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasPassword = Boolean(user.hasPassword);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (avatarPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(avatarPreviewUrl);
  }, [avatarPreviewUrl]);

  function resetFeedback() {
    setFormError("");
    setFormSuccess("");
  }

  function openNicknameModal() {
    setNickname(user.nickname || "");
    resetFeedback();
    setShowNicknameModal(true);
  }

  function openAvatarModal() {
    if (avatarPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(avatarPreviewUrl);
    setSelectedAvatarFile(null);
    setAvatarPreviewUrl(user.avatarUrl || "");
    setAvatarColor(user.avatarColor || "#7c6dfa");
    resetFeedback();
    setShowAvatarModal(true);
  }

  function openPwdModal() {
    setVerifyCode("");
    setVcCountdown(0);
    if (timerRef.current) clearInterval(timerRef.current);
    setNewPwd("");
    setConfirmPwd("");
    setShowNewPwd(false);
    setShowConfirmPwd(false);
    resetFeedback();
    setShowPwdModal(true);
  }

  async function saveProfile(body: Record<string, string>) {
    const response = await fetch("/api/user/profile", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await readJson(response);
    onUserUpdate(data.user);
    return data.user;
  }

  async function handleSaveNickname() {
    const value = nickname.trim();

    if (value.length < 2 || value.length > 20) {
      setFormError("昵称长度需为2-20个字");
      return;
    }

    try {
      setSaving(true);
      resetFeedback();
      await saveProfile({ nickname: value });
      setShowNicknameModal(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "昵称保存失败");
    } finally {
      setSaving(false);
    }
  }

  function handleAvatarFileChange(file: File | undefined) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFormError("仅支持 JPG、PNG、WebP 图片");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("头像图片不能超过 2MB");
      return;
    }

    if (avatarPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(avatarPreviewUrl);
    setSelectedAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
    resetFeedback();
  }

  async function handleSaveAvatar() {
    try {
      setSaving(true);
      resetFeedback();

      if (selectedAvatarFile) {
        const formData = new FormData();
        formData.append("avatar", selectedAvatarFile);
        const response = await fetch("/api/user/avatar", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await readJson(response);
        onUserUpdate(data.user);
      } else {
        await saveProfile({ avatarColor });
      }

      setShowAvatarModal(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "头像保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendPwdCode() {
    try {
      resetFeedback();
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user.phone, purpose: "reset_password" }),
      });
      await readJson(response);
      setVcCountdown(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setVcCountdown((value) => {
          if (value <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }

          return value - 1;
        });
      }, 1000);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "验证码发送失败");
    }
  }

  async function handlePwdConfirm() {
    if (!/^\d{6}$/.test(verifyCode)) {
      setFormError("请输入6位验证码");
      return;
    }

    if (newPwd.length < 8 || newPwd.length > 20) {
      setFormError("新密码长度需为8-20位");
      return;
    }

    if (newPwd !== confirmPwd) {
      setFormError("两次密码不一致");
      return;
    }

    try {
      setSaving(true);
      resetFeedback();
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode, newPassword: newPwd }),
      });
      const data = await readJson(response);
      onUserUpdate(data.user);
      setVerifyCode("");
      setNewPwd("");
      setConfirmPwd("");
      setFormSuccess(hasPassword ? "密码修改成功" : "密码设置成功");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "密码保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">账号设置</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          管理你的账号资料、登录方式和安全设置。
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">基本资料</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar user={user} size="lg" />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
                  <Camera size={10} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">头像</p>
                <p className="text-xs text-muted-foreground">支持上传 JPG、PNG、WebP，最大 2MB</p>
              </div>
            </div>
            <button onClick={openAvatarModal} className="text-sm text-[#7c6dfa] hover:underline">修改头像</button>
          </div>

          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">昵称</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{getDisplayName(user)}</p>
            </div>
            <button onClick={openNicknameModal} className="text-sm text-[#7c6dfa] hover:underline">编辑</button>
          </div>

          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">绑定手机号</p>
              <p className="mt-0.5 font-mono text-sm text-muted-foreground">{maskPhone(user.phone)}</p>
            </div>
            <button className="text-sm text-muted-foreground/60" disabled>更换手机号</button>
          </div>
        </div>
      </section>

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
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    hasPassword
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-500"
                  }`}>
                    <CheckCircle size={9} />{hasPassword ? "已设置" : "未设置"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {hasPassword ? "建议定期修改密码，保护账号安全。" : "设置密码后可使用手机号和密码登录。"}
                </p>
              </div>
            </div>
            <button
              onClick={openPwdModal}
              className="shrink-0 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-foreground"
            >
              {hasPassword ? "修改密码" : "设置密码"}
            </button>
          </div>
        </div>
      </section>

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

      {showNicknameModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNicknameModal(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-2xl border border-border bg-card p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowNicknameModal(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
              <X size={15} />
            </button>
            <h3 className="text-lg font-semibold text-foreground">修改昵称</h3>
            <p className="mt-1 text-xs text-muted-foreground">昵称长度 2-20 个字</p>
            <input
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); resetFeedback(); }}
              maxLength={20}
              className="mt-5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-[#7c6dfa]/60"
              placeholder="请输入昵称"
            />
            {formError && <p className="mt-3 text-xs text-red-500">{formError}</p>}
            <button
              onClick={handleSaveNickname}
              disabled={saving}
              className="mt-5 w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      )}

      {showAvatarModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAvatarModal(false)} />
          <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-border bg-card p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAvatarModal(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
              <X size={15} />
            </button>
            <h3 className="text-lg font-semibold text-foreground">修改头像</h3>
            <p className="mt-1 text-xs text-muted-foreground">选择本地图片上传，未选择图片时可保存预设颜色头像。</p>
            <div className="mt-5 flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: avatarPreviewUrl ? undefined : avatarColor }}
              >
                {avatarPreviewUrl ? (
                  <img src={avatarPreviewUrl} alt="头像预览" className="size-full object-cover" />
                ) : (
                  getAvatarText(user)
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setAvatarColor(color);
                      setSelectedAvatarFile(null);
                      if (avatarPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(avatarPreviewUrl);
                      setAvatarPreviewUrl("");
                      resetFeedback();
                    }}
                    className={`h-8 w-8 rounded-full border-2 ${avatarColor === color && !avatarPreviewUrl ? "border-white" : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                    aria-label={`选择头像颜色 ${color}`}
                  />
                ))}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => handleAvatarFileChange(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-[#7c6dfa]/40"
            >
              {selectedAvatarFile ? selectedAvatarFile.name : "选择本地图片"}
            </button>
            {formError && <p className="mt-3 text-xs text-red-500">{formError}</p>}
            <button
              onClick={handleSaveAvatar}
              disabled={saving}
              className="mt-5 w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white transition-all hover:bg-[#6c5de8] disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存头像"}
            </button>
          </div>
        </div>
      )}

      {showPwdModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPwdModal(false)} />
          <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-border bg-card p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPwdModal(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
              <X size={15} />
            </button>
            {formSuccess ? (
              <div className="flex flex-col items-center py-2 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{formSuccess}</h3>
                <p className="mt-2 mb-7 text-sm text-muted-foreground">下次登录可以使用新密码。</p>
                <button onClick={() => setShowPwdModal(false)} className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all">
                  完成
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{hasPassword ? "修改密码" : "设置密码"}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">验证码将发送至 {maskPhone(user.phone)}。</p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="请输入短信验证码"
                    value={verifyCode}
                    onChange={(event) => { setVerifyCode(event.target.value.replace(/\D/g, "").slice(0, 6)); resetFeedback(); }}
                    className="min-w-0 flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60"
                  />
                  <button
                    type="button"
                    onClick={handleSendPwdCode}
                    disabled={vcCountdown > 0}
                    className="shrink-0 rounded-xl border border-border bg-secondary px-3 py-3 text-xs font-medium text-muted-foreground transition-all hover:border-[#7c6dfa]/30 hover:text-[#7c6dfa] disabled:opacity-50"
                  >
                    {vcCountdown > 0 ? `${vcCountdown}s` : "获取验证码"}
                  </button>
                </div>
                <PasswordInput
                  value={newPwd}
                  onChange={(value) => { setNewPwd(value); resetFeedback(); }}
                  visible={showNewPwd}
                  onToggleVisible={() => setShowNewPwd((v) => !v)}
                  placeholder="请输入新密码"
                />
                <PasswordInput
                  value={confirmPwd}
                  onChange={(value) => { setConfirmPwd(value); resetFeedback(); }}
                  visible={showConfirmPwd}
                  onToggleVisible={() => setShowConfirmPwd((v) => !v)}
                  placeholder="请再次输入新密码"
                />
                {formError && <p className="text-xs text-red-500">{formError}</p>}
                <button
                  onClick={handlePwdConfirm}
                  disabled={saving}
                  className="w-full rounded-xl bg-[#7c6dfa] py-3 text-sm font-medium text-white hover:bg-[#6c5de8] transition-all disabled:opacity-50"
                >
                  {saving ? "保存中..." : hasPassword ? "确认修改" : "确认设置"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-2xl border border-border bg-card p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDeleteModal(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
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
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
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

function PasswordInput({
  value,
  onChange,
  visible,
  onToggleVisible,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Lock size={14} />
      </div>
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#7c6dfa]/60"
      />
      <button
        type="button"
        onClick={onToggleVisible}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}
