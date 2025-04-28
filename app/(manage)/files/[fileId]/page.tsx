import { FileEditForm } from "@/components/files/file-edit-form";
import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function FilePage(props: {
  params: Promise<{
    fileId: string;
  }>;
}) {
  const params = await props.params;
  const user = await getRequiredUser();

  const file = await prisma.item.findUnique({
    where: {
      id: params.fileId,
      userId: user.id,
    },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className="container py-10 max-w-2xl space-y-8">
      <FileEditForm limitation={user.limitations} file={file} />
    </div>
  );
}
