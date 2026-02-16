from .models import Block


# -----------------------------------
# 1️⃣ Create Genesis Block
# -----------------------------------
def create_genesis_block():

    if not Block.objects.exists():

        genesis = Block(
            index=0,
            block_type="GENESIS",
            batch_id="GENESIS",
            previous_hash="0"
        )

        genesis.save()
        genesis.hash = genesis.calculate_hash()
        genesis.save()


# -----------------------------------
# 2️⃣ Add New Block (Dynamic by block_type)
# -----------------------------------
# def add_block(data):

#     last_block = Block.objects.order_by("index").last()

#     new_block = Block(
#         index=last_block.index + 1,
#         block_type=data.get("block_type"),
#         batch_id=data.get("batch_id"),
#         previous_hash=last_block.hash,

#         # Farmer
#         farmer_id=data.get("farmer_id"),
#         herb=data.get("herb"),
#         quantity=data.get("quantity"),
#         location=data.get("location"),

#         # Manufacturer
#         manufacturer_id=data.get("manufacturer_id"),
#         processing_details=data.get("processing_details"),

#         # Auditor
#         auditor_id=data.get("auditor_id"),
#         remarks=data.get("remarks"),
#     )

#     new_block.save()
#     new_block.hash = new_block.calculate_hash()
#     new_block.save()

#     return new_block


def add_block(**data):

    last_block = Block.objects.order_by("index").last()

    block_type = data.get("block_type")
    batch_id = data.get("batch_id")

    # 🚫 Prevent duplicate block type for same batch
    if Block.objects.filter(batch_id=batch_id, block_type=block_type).exists():
        raise Exception(f"{block_type} block already exists for this batch")

    new_block = Block(
        index=last_block.index + 1,
        block_type=block_type,
        batch_id=batch_id,
        farmer_id=data.get("farmer_id"),
        herb=data.get("herb"),
        quantity=data.get("quantity"),
        location=data.get("location"),
        manufacturer_id=data.get("manufacturer_id"),
        processing_details=data.get("processing_details"),
        auditor_id=data.get("auditor_id"),
        remarks=data.get("remarks"),
        previous_hash=last_block.hash
    )

    new_block.save()
    new_block.hash = new_block.calculate_hash()
    new_block.save()

    return new_block


# -----------------------------------
# 3️⃣ Validate Blockchain
# -----------------------------------
def is_chain_valid():

    blocks = list(Block.objects.all().order_by("index"))

    for i in range(1, len(blocks)):

        current = blocks[i]
        previous = blocks[i - 1]

        # Check hash link
        if current.previous_hash != previous.hash:
            return False

        # Recalculate and check
        if current.hash != current.calculate_hash():
            return False

    return True
