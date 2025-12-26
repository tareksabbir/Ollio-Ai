import { caller } from "@/trpc/server"


const Page = async() => {
    const data = await caller.createAI({text: "MADARI"})
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}

export default Page
