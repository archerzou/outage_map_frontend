import { neon } from '@neondatabase/serverless'
import type { OutageData } from '../types/outage'

// Database connection
const sql = neon(process.env.VITE_DATABASE_URL || '')

export class OutageService {
  static async getAllOutages(): Promise<OutageData[]> {
    try {
      const result = await sql`
        SELECT
          id,
          title,
          description,
          latitude,
          longitude,
          severity,
          status,
          affected_customers as "affectedCustomers",
          estimated_restoration as "estimatedRestoration",
          created_at as "createdAt",
          updated_at as "updatedAt",
          outage_type as "outageType",
          provider,
          region
        FROM outages
        ORDER BY created_at DESC
      `

      return result.map(row => ({
        ...row,
        estimatedRestoration: row.estimatedRestoration ? new Date(row.estimatedRestoration) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      })) as OutageData[]
    } catch (error) {
      console.error('Error fetching outages:', error)
      return []
    }
  }

  static async createOutage(outage: Omit<OutageData, 'id' | 'createdAt'>): Promise<OutageData | null> {
    try {
      const result = await sql`
        INSERT INTO outages (
          title, description, latitude, longitude, severity, status,
          affected_customers, estimated_restoration, outage_type, provider, region
        ) VALUES (
          ${outage.title}, ${outage.description}, ${outage.latitude}, ${outage.longitude},
          ${outage.severity}, ${outage.status}, ${outage.affectedCustomers},
          ${outage.estimatedRestoration || null}, ${outage.outageType || null},
          ${outage.provider || null}, ${outage.region || null}
        )
        RETURNING
          id,
          title,
          description,
          latitude,
          longitude,
          severity,
          status,
          affected_customers as "affectedCustomers",
          estimated_restoration as "estimatedRestoration",
          created_at as "createdAt",
          updated_at as "updatedAt",
          outage_type as "outageType",
          provider,
          region
      `

      if (result.length > 0) {
        const row = result[0]
        return {
          ...row,
          estimatedRestoration: row.estimatedRestoration ? new Date(row.estimatedRestoration) : undefined,
          createdAt: new Date(row.createdAt),
          updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
        } as OutageData
      }

      return null
    } catch (error) {
      console.error('Error creating outage:', error)
      return null
    }
  }

  static async updateOutage(id: string, updates: Partial<OutageData>): Promise<OutageData | null> {
    try {
      const result = await sql`
        UPDATE outages
        SET
          title = COALESCE(${updates.title || null}, title),
          description = COALESCE(${updates.description || null}, description),
          severity = COALESCE(${updates.severity || null}, severity),
          status = COALESCE(${updates.status || null}, status),
          affected_customers = COALESCE(${updates.affectedCustomers || null}, affected_customers),
          estimated_restoration = COALESCE(${updates.estimatedRestoration || null}, estimated_restoration),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING
          id,
          title,
          description,
          latitude,
          longitude,
          severity,
          status,
          affected_customers as "affectedCustomers",
          estimated_restoration as "estimatedRestoration",
          created_at as "createdAt",
          updated_at as "updatedAt",
          outage_type as "outageType",
          provider,
          region
      `

      if (result.length > 0) {
        const row = result[0]
        return {
          ...row,
          estimatedRestoration: row.estimatedRestoration ? new Date(row.estimatedRestoration) : undefined,
          createdAt: new Date(row.createdAt),
          updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
        } as OutageData
      }

      return null
    } catch (error) {
      console.error('Error updating outage:', error)
      return null
    }
  }

  static async deleteOutage(id: string): Promise<boolean> {
    try {
      const result = await sql`DELETE FROM outages WHERE id = ${id}`
      return result.length > 0
    } catch (error) {
      console.error('Error deleting outage:', error)
      return false
    }
  }
}

// Database schema creation (run this once to set up the database)
export const createOutagesTable = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS outages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
        status VARCHAR(20) CHECK (status IN ('active', 'resolved', 'investigating')) NOT NULL,
        affected_customers INTEGER DEFAULT 0,
        estimated_restoration TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        outage_type VARCHAR(50),
        provider VARCHAR(100),
        region VARCHAR(100)
      )
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_outages_status ON outages(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_outages_severity ON outages(severity)`
    await sql`CREATE INDEX IF NOT EXISTS idx_outages_created_at ON outages(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_outages_location ON outages(latitude, longitude)`

    console.log('Outages table created successfully')
  } catch (error) {
    console.error('Error creating outages table:', error)
  }
}
