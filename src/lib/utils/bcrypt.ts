import bcrypt from "bcryptjs";


export const hashGenerator = async (password: string): Promise<string> => {
    const hashedText = await bcrypt.hash(password, 10)
    return hashedText
}

export const CompareHashes = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}