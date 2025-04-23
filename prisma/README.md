# Prisma Schema Management

This directory contains the Prisma schema configuration for the Learniverse application. The schema is organized into separate model files for better maintainability.

## Directory Structure

```
prisma/
├── models/                    # Individual model files
│   ├── course.model.prisma   # Course model
│   ├── category.model.prisma # Category model
│   ├── chapter.model.prisma  # Chapter and MuxData models
│   └── ...                   # Other model files
├── schema.prisma             # Generated combined schema
└── combine-models.js         # Script to combine models
```

## Working with Models

### Model Files

Each model is defined in its own file under the `models/` directory. This separation helps with:

- Better code organization
- Easier version control
- Focused model development
- Simplified model relationships management

### Available Models

- `course.model.prisma`: Main course entity
- `category.model.prisma`: Course categories
- `chapter.model.prisma`: Course chapters and video data
- `attachment.model.prisma`: Course attachments
- `purchase.model.prisma`: Course purchases
- `course-rating.model.prisma`: Course ratings and reviews
- `mcq.model.prisma`: Multiple choice questions
- `user-progress.model.prisma`: User progress tracking

## Development Workflow

1. **Making Changes**

   - Edit or create model files in the `models/` directory
   - Follow the `.model.prisma` naming convention
   - Ensure proper model relationships

2. **Combining Models**

   ```bash
   node combine-models.js
   ```

   This will:

   - Read all .model.prisma files
   - Combine them with the database configuration
   - Generate the final schema.prisma file

3. **After Combining**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # If schema changes require database updates
   npx prisma db push
   # or for production
   npx prisma migrate deploy
   ```

## Best Practices

1. **Model Organization**

   - Keep related models in the same file (e.g., Chapter and MuxData)
   - Use clear, descriptive model names
   - Document relationships between models

2. **Schema Updates**

   - Always run the combine script after model changes
   - Validate the schema before pushing changes
   - Keep model files focused and concise

3. **Version Control**
   - Commit both individual model files and the combined schema
   - Include meaningful commit messages for schema changes
   - Review schema diffs carefully
