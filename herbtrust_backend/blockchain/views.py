from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Block
from .utils import add_block, create_genesis_block, is_chain_valid


# class AddBlockView(APIView):

#     def post(self, request):

#         create_genesis_block()

#         block = add_block(request.data)

#         return Response({
#             "message": "Block added successfully",
#             "index": block.index,
#             "hash": block.hash
#         })

class AddBlockView(APIView):

    def post(self, request):

        create_genesis_block()

        try:
            block = add_block(**request.data)

            return Response({
                "message": "Block added successfully",
                "hash": block.hash
            })

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=400)

class GetChainView(APIView):

    def get(self, request):

        blocks = Block.objects.all().order_by("index")

        data = []

        for block in blocks:
            data.append({
                "index": block.index,
                "timestamp": block.timestamp,
                "block_type": block.block_type,
                "batch_id": block.batch_id,
                "farmer_id": block.farmer_id,
                "herb": block.herb,
                "quantity": block.quantity,
                "location": block.location,
                "manufacturer_id": block.manufacturer_id,
                "processing_details": block.processing_details,
                "auditor_id": block.auditor_id,
                "remarks": block.remarks,
                "previous_hash": block.previous_hash,
                "hash": block.hash,
            })

        return Response(data)


class ValidateChainView(APIView):

    def get(self, request):

        return Response({
            "valid": is_chain_valid()
        })
