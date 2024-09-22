import { NextRequest,NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); //connection established

export async function GET(request: NextRequest){
    try{
        const videos = await prisma.video.findMany({
            orderBy:{
                createdAt:"desc"
            }
            
        })
        return NextResponse.json(videos)
    } catch(error:any){
        return NextResponse.json({error:"Error fetching videos",details:error.message},
        {
            status:500
        }
    )
    }
    finally{
        await prisma.$disconnect()
    }

}