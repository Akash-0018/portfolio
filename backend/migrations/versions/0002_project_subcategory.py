"""Add projects.subcategory

Splits a category into finer groups - used by College projects, which are
divided into Full-Stack, ML, AI and MCP.

Revision ID: 0002_project_subcategory
Revises: 0001_initial_schema
"""
import sqlalchemy as sa
from alembic import op

revision = '0002_project_subcategory'
down_revision = '0001_initial_schema'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('projects') as batch_op:
        batch_op.add_column(sa.Column('subcategory', sa.String(length=100), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('projects') as batch_op:
        batch_op.drop_column('subcategory')
