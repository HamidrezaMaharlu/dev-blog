import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage} from "next";
import {readPostData} from "@/pages/api/post";
import {ParsedUrlQuery} from "querystring";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import {MDXRemote, MDXRemoteSerializeResult} from "next-mdx-remote";
import {serialize} from "next-mdx-remote/serialize";


export const getStaticPaths: GetStaticPaths = async () => {
    const data = readPostData()
    const paths = data.map(item => ({params: {blogSlug: item.slug}}))
    return {
        paths,
        fallback: "blocking"
    }
}

interface BlogSlug extends ParsedUrlQuery {
    blogSlug: string
}

type PostProps = {
    post: { title: string, context: MDXRemoteSerializeResult }
}

export const getStaticProps: GetStaticProps<PostProps> = async ({params}) => {
    // by add this try catch block we don't get error 500 when the route doesn't exist,
    // and it shows not page found 404
    try {
        const {blogSlug} = params as BlogSlug
        const filePath = path.join(process.cwd(), `posts/${blogSlug}.md`)
        const fileData = fs.readFileSync(filePath, {encoding: "utf-8"})
        const context = matter(fileData)
        const mdxSource = await serialize(context.content)
        return {
            props: {post: {title: context.data.title, context: mdxSource}}
        }
    } catch (e) {
        return {notFound: true}
    }

}

type Props = InferGetStaticPropsType<typeof getStaticProps>
const PostPage: NextPage<Props> = ({post}) => {
    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-semibold py-5">{post.title}</h1>
            <article className="prose lg:prose-xl">
                <MDXRemote {...post.context}/>
            </article>
        </div>
    );
};


export default PostPage;