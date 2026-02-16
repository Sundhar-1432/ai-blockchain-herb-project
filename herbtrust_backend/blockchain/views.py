from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Block
from .utils import add_block, create_genesis_block, is_chain_valid


class AddBlockView(APIView):

    def post(self, request):

        try:
            # Ensure genesis block exists
            create_genesis_block()

            block = add_block(
                farmer_id=request.data["farmer_id"],
                batch_id=request.data["batch_id"],
                herb=request.data["herb"],
                quantity=request.data["quantity"],
                location=request.data["location"]
            )

            return Response({
                "message": "Block added successfully",
                "hash": block.hash
            })

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class GetChainView(APIView):

    def get(self, request):

        blocks = Block.objects.all().order_by("index")

        data = []

        for block in blocks:
            data.append({
                "index": block.index,
                "timestamp": block.timestamp,
                # "block_type": block.block_type,
                "farmer_id": block.farmer_id,
                # "manufacturer_id": block.manufacturer_id,
                # "auditor_id": block.auditor_id,
                "batch_id": block.batch_id,
                "herb": block.herb,
                "quantity": block.quantity,
                "location": block.location,
                "previous_hash": block.previous_hash,
                "hash": block.hash
            })

        return Response(data)


class ValidateChainView(APIView):

    def get(self, request):
        return Response({
            "valid": is_chain_valid()
        })
