from .models import Block


# -----------------------------------
# 1️⃣ Create Genesis Block
# -----------------------------------
def create_genesis_block():

    if not Block.objects.exists():

        genesis = Block(
            index=0,
            block_type="GENESIS",
            farmer_id=None,
            manufacturer_id=None,
            auditor_id=None,
            batch_id="GENESIS",
            herb="GENESIS",
            quantity=0,
            location="GENESIS",
            previous_hash="0"
        )

        genesis.save()
        genesis.hash = genesis.calculate_hash()
        genesis.save()


# -----------------------------------
# 2️⃣ Add New Block
# -----------------------------------
def add_block(farmer_id, batch_id, herb, quantity, location):

    # 🔒 Prevent duplicate batch submission
    if Block.objects.filter(batch_id=batch_id).exists():
        raise Exception("Batch already exists in blockchain")

    last_block = Block.objects.order_by("index").last()

    new_block = Block(
        index=last_block.index + 1,
        block_type="FARMER",   # you can change dynamically later
        farmer_id=farmer_id,
        manufacturer_id=None,
        auditor_id=None,
        batch_id=batch_id,
        herb=herb,
        quantity=quantity,
        location=location,
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

    # 1️⃣ Check Genesis Exists
    if not blocks:
        return False

    if blocks[0].index != 0:
        return False

    for i in range(1, len(blocks)):

        current = blocks[i]
        previous = blocks[i - 1]

        # 🔗 Check hash linkage
        if current.previous_hash != previous.hash:
            print("Previous hash mismatch at block", current.index)
            return False

        # 🔐 Recalculate hash and compare
        if current.hash != current.calculate_hash():
            print("Hash mismatch at block", current.index)
            return False

    return True
