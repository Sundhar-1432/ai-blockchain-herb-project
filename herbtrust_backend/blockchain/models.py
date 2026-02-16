from django.db import models
import hashlib
import json


class Block(models.Model):

    # -------------------------
    # Core Blockchain Fields
    # -------------------------
    index = models.IntegerField(unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    previous_hash = models.CharField(max_length=64)
    hash = models.CharField(max_length=64)

    # -------------------------
    # Block Type
    # -------------------------
    block_type = models.CharField(max_length=20, null=True, blank=True)


    # -------------------------
    # Common Supply Chain Data
    # -------------------------
    batch_id = models.CharField(max_length=100)

    # -------------------------
    # Role-specific fields
    # -------------------------

    # Farmer fields
    farmer_id = models.IntegerField(null=True, blank=True)
    herb = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.FloatField(null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)

    # Manufacturer fields
    manufacturer_id = models.IntegerField(null=True, blank=True)
    processing_details = models.TextField(null=True, blank=True)

    # Auditor fields
    auditor_id = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)

    # -------------------------
    # Hash Calculation
    # -------------------------
    def calculate_hash(self):

        block_string = json.dumps({
            "index": self.index,
            "timestamp": str(self.timestamp),
            "block_type": self.block_type,
            "batch_id": self.batch_id,
            "farmer_id": self.farmer_id,
            "herb": self.herb,
            "quantity": self.quantity,
            "location": self.location,
            "manufacturer_id": self.manufacturer_id,
            "processing_details": self.processing_details,
            "auditor_id": self.auditor_id,
            "remarks": self.remarks,
            "previous_hash": self.previous_hash
        }, sort_keys=True)

        return hashlib.sha256(block_string.encode()).hexdigest()
