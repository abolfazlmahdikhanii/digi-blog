import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/router";

const TopicWrapper = ({ title, children, isBreadCrumb = false, pageName }) => {
  const router = useRouter();

  return (
    <div className={`flex gap-x-10 `}>
      <div className="basis-[40%]">
        {isBreadCrumb && (
          <Breadcrumb className="mb-12">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    className="capitalize text-[13px]"
                    href={`/tags/${router.query.slug}`}
                  >
                    {router.query.slug}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize text-[13px]">
                  {pageName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h2 className="text-[40px] font-normal leading-[55px] capitalize font-headline mb-4  w-[370px] ">
          {title}
        </h2>
      </div>
      <div className="space-y-6 basis-[60%] mt-3">{children}</div>
    </div>
  );
};

export default TopicWrapper;
