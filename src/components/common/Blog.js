"use client";

import { blogs } from "@/data/blogs";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAutoTranslate } from "@/hooks/useTranslate";

const Blog = () => {
  const { t } = useTranslation('common');

  // Auto-translate blog titles
  const { data: translatedBlogs, isTranslating } = useAutoTranslate(blogs, ['title']);

  if (isTranslating) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  return (
    <>
      {translatedBlogs.map((blog) => (
        <div className="col-sm-6 col-lg-4" key={blog.id}>
          <div className="blog-style1">
            <div className="blog-img" style={{ height: '271px', overflow: 'hidden', position: 'relative' }}>
              <Image
                width={386}
                height={271}
                className="w-100 h-100 cover"
                style={{ objectFit: 'cover', width: '100%', height: '271px' }}
                src={blog.image}
                alt="blog"
              />
            </div>
            <div className="blog-content">
              <div className="date">
                <span className="month">{t('blog.july')}</span>
                <span className="day">{blog.date.day}</span>
              </div>
              <a className="tag" href="#">
                {t('blog.livingRoom')}
              </a>
              <h6 className="title mt-1">
                <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
              </h6>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Blog;
