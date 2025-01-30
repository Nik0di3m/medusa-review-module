import {
  CheckCircleMiniSolid,
  EllipsisHorizontal,
  Trash,
  XCircleSolid,
} from "@medusajs/icons";
import { DropdownMenu, IconButton } from "@medusajs/ui";

export function ActionsDropdown({
  review_id,
  onSuccesApprove,
  onSuccesReject,
  onSuccesDelete,
}: {
  review_id: string;
  onSuccesApprove: () => void;
  onSuccesReject: () => void;
  onSuccesDelete: () => void;
}) {
  const handleApprove = async () => {
    try {
      const res = await fetch(`/admin/review/update/${review_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });
      console.log(res);
      onSuccesApprove();
    } catch (error) {
      console.error(error);
    }
  };
  const handleReject = async () => {
    try {
      const res = await fetch(`/admin/review/update/${review_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      console.log(res);
      onSuccesReject();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/admin/review/delete/${review_id}`, {
        method: "DELETE",
      });
      console.log(res);
      onSuccesDelete();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2" onClick={handleApprove}>
          <CheckCircleMiniSolid color="#10b981" />
          Approve
        </DropdownMenu.Item>
        <DropdownMenu.Item className="gap-x-2" onClick={handleReject}>
          <XCircleSolid color="#fb7185" />
          Reject
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
