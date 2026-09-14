# Database Migration Guide: Local PostgreSQL to Render

## Prerequisites
- PostgreSQL client tools installed locally
- Access to your local PostgreSQL database
- Render PostgreSQL database created and credentials available

## Step 1: Export Local Database

### Option A: Full Database Dump (Recommended)
```bash
# Export entire database with data and schema
# For Windows (using full path):
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h localhost -U "<your-postgres-user>" -d <your-database> > bitby_local_backup.sql

# If you need to specify password in command (less secure)
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h localhost -U "<your-postgres-user>" -W -d <your-database> > bitby_local_backup.sql
```

### Option B: Schema Only (if you want to start fresh)
```bash
# Export only the database schema
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h localhost -U "<your-postgres-user>" --schema-only -d <your-database> > bitby_schema_only.sql
```

### Option C: Data Only (if schema already exists)
```bash
# Export only the data
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h localhost -U "<your-postgres-user>" --data-only -d <your-database> > bitby_data_only.sql
```

### Option D: Use the Migration Script (Easiest)
```bash
# Run the Windows batch script
migrate-db.bat
```

## Step 2: Prepare Render Database

### Get Render Database Credentials
1. Go to your Render dashboard
2. Navigate to your PostgreSQL database
3. Copy the **Internal Database URL** (for Render services)
4. Copy the **External Database URL** (for migration)

### Create Database Schema (if needed)
```bash
# Connect to Render database and create schema
"C:\Program Files\PostgreSQL\17\bin\psql.exe" "your-render-external-database-url" -f bitby_schema_only.sql
```

## Step 3: Import Data to Render

### Import Full Database
```bash
# Import the complete backup
"C:\Program Files\PostgreSQL\17\bin\psql.exe" "your-render-external-database-url" -f bitby_local_backup.sql
```

### Import Data Only
```bash
# Import only data (if schema already exists)
"C:\Program Files\PostgreSQL\17\bin\psql.exe" "your-render-external-database-url" -f bitby_data_only.sql
```

## Step 4: Verify Migration

### Check Data Integrity
```bash
# Connect to Render database
"C:\Program Files\PostgreSQL\17\bin\psql.exe" "your-render-external-database-url"

# Check table counts
SELECT schemaname, tablename, n_tup_ins as inserts, n_tup_upd as updates, n_tup_del as deletes 
FROM pg_stat_user_tables;

# Check specific tables
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM trades;
SELECT COUNT(*) FROM cryptocurrencies;
SELECT COUNT(*) FROM trading_pairs;
```

## Step 5: Update Application Configuration

### Update Environment Variables in Render
Set these in your Render web service environment variables:

```bash
# Database Configuration
DB_URL=jdbc:postgresql://your-render-internal-host:5432/your-database-name
DB_USER=your-render-database-user
DB_PASSWORD=your-render-database-password
```

### Test Connection
1. Deploy your application to Render
2. Check the logs for database connection success
3. Test a few API endpoints to ensure data is accessible

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verify you're using the correct database URL
   - Check if Render database is active
   - Ensure you're using internal URL for application, external for migration

2. **Permission Denied**
   - Verify database credentials
   - Check if user has proper permissions

3. **Data Import Errors**
   - Check for foreign key constraints
   - Verify data types match between local and Render
   - Look for any custom functions or extensions

4. **Large Data Sets**
   - For large databases, consider using `pg_dump` with compression:
   ```bash
   "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h localhost -U "<your-postgres-user>" -d <your-database> | gzip > bitby_backup.sql.gz
   gunzip -c bitby_backup.sql.gz | "C:\Program Files\PostgreSQL\17\bin\psql.exe" "your-render-external-database-url"
   ```

### Data Validation Commands

```sql
-- Check if all tables exist
\dt

-- Check table row counts
SELECT 
    schemaname,
    tablename,
    n_tup_ins as rows
FROM pg_stat_user_tables
ORDER BY n_tup_ins DESC;

-- Check for any data inconsistencies
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'trades', COUNT(*) FROM trades
UNION ALL
SELECT 'cryptocurrencies', COUNT(*) FROM cryptocurrencies;
```

## Best Practices

1. **Backup Before Migration**
   - Always create a backup before starting migration
   - Test migration on a copy first if possible

2. **Downtime Planning**
   - Plan for minimal downtime during migration
   - Consider doing migration during low-traffic hours

3. **Data Verification**
   - Always verify data integrity after migration
   - Test critical application functions

4. **Rollback Plan**
   - Keep local database running until migration is verified
   - Have a plan to rollback if issues arise

## Post-Migration Checklist

- [ ] All tables migrated successfully
- [ ] Row counts match between local and Render
- [ ] Application connects to Render database
- [ ] All API endpoints work correctly
- [ ] User authentication works
- [ ] Trading functionality works
- [ ] P2P features work
- [ ] Email notifications work
- [ ] Telegram bot integration works
- [ ] Paystack integration works

## Security Notes

1. **Credentials**
   - Never commit database credentials to Git
   - Use Render's environment variable system
   - Rotate passwords after migration

2. **Access Control**
   - Render's free tier PostgreSQL is internal only
   - External access is limited to migration purposes
   - Consider removing external access after migration

3. **Data Privacy**
   - Ensure sensitive data is properly encrypted
   - Verify GDPR compliance if applicable