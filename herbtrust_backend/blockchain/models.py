from django.db import models
import hashlib
import json

class Block(models.Model):
    index = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    farmer_id = models.IntegerField()
    batch_id = models.CharField(max_length=100)

    herb = models.CharField(max_length=100)
    quantity = models.FloatField()
    location = models.CharField(max_length=255)

    previous_hash = models.CharField(max_length=256)
    hash = models.CharField(max_length=256)

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": str(self.timestamp),
            "farmer_id": self.farmer_id,
            "batch_id": self.batch_id,
            "herb": self.herb,
            "quantity": self.quantity,
            "location": self.location,
            "previous_hash": self.previous_hash,
        }, sort_keys=True).encode()

        return hashlib.sha256(block_string).hexdigest()
