// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "AIRTABLE_TABLE_NAME"]

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.warn(`Missing environment variables: ${missingEnvVars.join(", ")}`)
    console.warn("Using mock data instead of Airtable API")
    return false
  }

  return true
}
