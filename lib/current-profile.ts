import { auth } from '@clerk/nextjs/server'
import { db } from "./db"

export const currentProfile = async () => {
    const { userId } = auth();
    if (!userId) return null;
    try {
        const profile = await db.profile.findUnique({ where: { userId } })
        return profile
    } catch (error) {

    }
}