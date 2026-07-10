import { Crown } from "lucide-react";
import type { AuthUser } from "../App";

const SIZE_CLASS = {
  sm: {
    root: "h-8 w-8 text-xs",
    badge: "h-3.5 w-3.5 -bottom-0.5 -right-0.5",
    icon: 8,
  },
  md: {
    root: "h-10 w-10 text-base",
    badge: "h-4 w-4 -bottom-0.5 -right-0.5",
    icon: 9,
  },
  lg: {
    root: "h-14 w-14 text-xl",
    badge: "h-5 w-5 -bottom-1 -right-1",
    icon: 11,
  },
};

interface UserAvatarProps {
  user: AuthUser;
  size?: "sm" | "md" | "lg";
  showMemberBadge?: boolean;
  className?: string;
}

function getAvatarText(user: AuthUser) {
  return (user.nickname?.trim() || user.phone || "U").charAt(0).toUpperCase();
}

function getAltText(user: AuthUser) {
  return user.nickname?.trim() || user.phone || "用户头像";
}

export function UserAvatar({ user, size = "md", showMemberBadge = false, className = "" }: UserAvatarProps) {
  const classes = SIZE_CLASS[size];

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`flex ${classes.root} items-center justify-center overflow-hidden rounded-full font-bold text-white`}
        style={{ backgroundColor: user.avatarUrl ? undefined : user.avatarColor || "#7c6dfa" }}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={getAltText(user)} className="size-full object-cover" />
        ) : (
          getAvatarText(user)
        )}
      </div>
      {showMemberBadge && user.isMember && (
        <div className={`absolute flex ${classes.badge} items-center justify-center rounded-full bg-amber-500 shadow-sm`}>
          <Crown size={classes.icon} className="text-white" />
        </div>
      )}
    </div>
  );
}
