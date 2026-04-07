from celery_app import celery


@celery.task(name="pulseboard.tasks.healthcheck")
def healthcheck():
    return {"ok": True, "worker": "celery"}


@celery.task(name="pulseboard.tasks.summarize_payload")
def summarize_payload(payload: dict):
    keys = sorted(payload.keys())
    return {"ok": True, "key_count": len(keys), "keys": keys[:20]}
