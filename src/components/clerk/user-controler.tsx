"use client";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface Props {
  showName?: boolean;
}

const UserControl = ({ showName }: Props) => {
  const currentTheme = useCurrentTheme();

  return (
    <UserButton
      showName={showName}
      appearance={{
        elements: {
          userButtonBox: "rounded-full!",
          userButtonAvatarBox: "rounded-full! size-8!",
          userButtonTrigger: "rounded-full!",
        },
        baseTheme: currentTheme === "dark" ? dark : undefined,
      }}
    />
  );
};

export default UserControl;
