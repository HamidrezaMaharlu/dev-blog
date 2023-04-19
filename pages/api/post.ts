import {NextApiRequest, NextApiResponse} from "next";
import path from "path";
import fs from "fs";
import matter from "gray-matter";


export interface PostAPIResponse {
    data: POST[] | string
}

interface POST {
    title: string;
    meta: string;
    slug: string;
}


export default function handler(req: NextApiRequest, res: NextApiResponse<PostAPIResponse>) {
    const {method} = req;
    switch (method) {
        case "GET": {
            const data = readPostData()
            return res.status(200).json({data: data})
        }
        default:
            return res.status(404).json({data: "not found"})
    }
}

function readPostData():POST[] {
    const dirPath = path.join(process.cwd(), "posts")
    const directories = fs.readdirSync(dirPath)
    const posts = directories.map(dir => {
        const filePath = path.join(process.cwd(), "posts/" + dir)
        const fileContents = fs.readFileSync(filePath, {encoding: "utf-8"})
        return matter(fileContents).data as POST
    })
    return posts
}