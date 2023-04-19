import {FC} from "react";
import BlogCard from "@/components/BlogCard";
import {PostAPIResponse} from "@/pages/api/post";
import {InferGetStaticPropsType} from "next";




export const getStaticProps = async () => {
    const res = await fetch("http://localhost:3000/api/post")
    const {data}:PostAPIResponse = await res.json()
    return {
        props: {data}
    }
}

type Props =InferGetStaticPropsType<typeof getStaticProps>

const Blogs: FC<Props> = ({data}): JSX.Element => {
    return (
        <div className="max-w-3xl p-5 space-y-2 mx-auto">
            {Array.isArray(data) && data.map((item,index)=><BlogCard key={index} title={item.title} description={item.meta}/>)}
            {typeof data==="string" && data}
        </div>
    );
};

export default Blogs;