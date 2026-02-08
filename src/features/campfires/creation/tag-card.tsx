import Link from "next/link";
import React from "react";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagCardProps {
  _id: string;
  name: string;
  posts?: number;
  showCount?: boolean;
  compact?: boolean;
}

const TagCard = ({ _id, name, posts, showCount }: TagCardProps) => {
  return (
    <>
      {_id === "realm" ? (
        <Badge variant="outline">
          <Tag className="mr-1 h-3 w-3" />
          {name}
        </Badge>
      ) : (
        <Link href={`/tag/${_id}`} className="flex justify-between gap-2">
          <Badge variant="outline">
            <Tag className="mr-1 h-3 w-3" />
            {name}
          </Badge>

          {showCount && (
            <p className="small-medium text-dark500_light700">{posts}</p>
          )}
        </Link>
      )}
    </>
  );
};

export default TagCard;
