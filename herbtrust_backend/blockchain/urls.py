from django.urls import path
from .views import AddBlockView, GetChainView
from .views import ValidateChainView



# urlpatterns = [
#     path("add-block/", AddBlockView.as_view()),
#     path("chain/", GetChainView.as_view()),
#     path("validate/", ValidateChainView.as_view()),
# ]


urlpatterns = [
    path("add-block/", AddBlockView.as_view()),
    path("chain/", GetChainView.as_view()),
    path("validate/", ValidateChainView.as_view()),
]
