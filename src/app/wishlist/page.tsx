import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { WishlistContent } from "@/features/wishlist/components/wishlist-content";

export const metadata: Metadata = {
  title: "내가 찜한 책 | CERTICOS BOOKS",
};

export default function WishlistPage() {
  return (
    <PageContainer title="내가 찜한 책">
      <WishlistContent />
    </PageContainer>
  );
}
