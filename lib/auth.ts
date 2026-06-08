import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  console.log('Comparing password...')
  console.log('Plain password length:', password.length)
  console.log('Hashed password:', hashedPassword.substring(0, 20) + '...')
  const result = await bcrypt.compare(password, hashedPassword)
  console.log('Password comparison result:', result)
  return result
}
