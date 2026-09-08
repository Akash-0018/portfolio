"""Initial schema

Captures the schema that was previously produced by Base.metadata.create_all
plus the ad-hoc "ALTER TABLE profile_settings ADD COLUMN show_seminar" that ran
inside a try/except on every startup.

Databases created before Alembic was introduced are stamped with this revision
at startup rather than re-running it - see core.migrations.run_migrations.

Revision ID: 0001_initial_schema
Revises:
"""
import sqlalchemy as sa
from alembic import op

revision = '0001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('long_description', sa.Text(), nullable=True),
        sa.Column('tech_stack', sa.JSON(), nullable=False),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('live_url', sa.String(length=500), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('featured', sa.Boolean(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_projects_id', 'projects', ['id'])

    op.create_table(
        'seminars',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('organizer', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('tag', sa.String(length=50), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_seminars_id', 'seminars', ['id'])

    op.create_table(
        'contact_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('email', sa.String(length=320), nullable=False),
        sa.Column('subject', sa.String(length=300), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_contact_messages_id', 'contact_messages', ['id'])

    op.create_table(
        'profile_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('photo_url', sa.String(length=500), nullable=False),
        sa.Column('show_seminar', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_profile_settings_id', 'profile_settings', ['id'])

    op.create_table(
        'db_uploads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('data', sa.LargeBinary(), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_db_uploads_id', 'db_uploads', ['id'])
    op.create_index('ix_db_uploads_filename', 'db_uploads', ['filename'], unique=True)


def downgrade() -> None:
    op.drop_table('db_uploads')
    op.drop_table('profile_settings')
    op.drop_table('contact_messages')
    op.drop_table('seminars')
    op.drop_table('projects')
    op.drop_table('users')
