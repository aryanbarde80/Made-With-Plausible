FROM python:3.11-slim

WORKDIR /app

COPY apps/celery-worker/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/celery-worker /app

CMD ["celery", "-A", "celery_app.celery", "worker", "--loglevel=INFO"]
