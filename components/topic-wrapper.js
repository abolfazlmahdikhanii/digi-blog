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
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
      {/* Left Column - Title Section */}
      <div className="w-full lg:basis-[40%] lg:flex-shrink-0">
        {isBreadCrumb && (
          <Breadcrumb className="mb-6 sm:mb-8 lg:mb-12">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    className="capitalize text-xs sm:text-[13px]"
                    href={`/tags/${router.query.slug}`}
                  >
                    {router.query.slug}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize text-xs sm:text-[13px]">
                  {pageName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-tight sm:leading-snug lg:leading-[55px] capitalize font-headline mb-4 sm:mb-6 lg:mb-4 max-w-full lg:max-w-[370px]">
          {title}
        </h2>
      </div>

      {/* Right Column - Content Section */}
      <div className="w-full lg:basis-[60%] space-y-4 sm:space-y-6 lg:mt-3">
        {children}
      </div>
    </div>
  );
};

export default TopicWrapper;