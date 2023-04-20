import {FC} from "react";
import BlogCard from "@/components/BlogCard";
import {readPostData} from "@/pages/api/post";
import {InferGetStaticPropsType} from "next";




export const getStaticProps = async () => {
  const data = readPostData()
  return {
    props: {data}
  }
}

type Props =InferGetStaticPropsType<typeof getStaticProps>

const Index: FC<Props> = ({data}): JSX.Element => {
  return (
      <div className="max-w-3xl p-5 space-y-2 mx-auto">
        {Array.isArray(data) && data.map((item,index)=><BlogCard key={index} title={item.title} description={item.meta} slug={item.slug}/>)}
      </div>
  );
};

export default Index;