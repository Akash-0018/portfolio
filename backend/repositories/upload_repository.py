from models.upload import Upload
from repositories.base import BaseRepository


class UploadRepository(BaseRepository[Upload]):
    model = Upload

    def find_by_filename(self, filename: str) -> Upload | None:
        return self.db.query(Upload).filter(Upload.filename == filename).first()
