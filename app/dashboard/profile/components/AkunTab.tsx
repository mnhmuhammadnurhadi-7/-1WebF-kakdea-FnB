import { AkunCard } from "./AkunCard";
import { UserListCard } from "./UserListCard";
import type { UserData } from "./types";

type AkunTabProps = { user: UserData; onUser: (u: UserData) => void; onSave: () => void };

export function AkunTab({ user, onUser, onSave }: AkunTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <AkunCard user={user} onUser={onUser} onSave={onSave} />
      <UserListCard user={user} />
    </div>
  );
}
