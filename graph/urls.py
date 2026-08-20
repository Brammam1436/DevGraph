from django.urls import path

from .views import (
    GraphApiView,
    DeveloperGraphApiView,
    DeveloperProfileApiView
)

from .views import (
    CognoDBTestAPIView,
    DeveloperListAPIView,
    DeveloperDetailAPIView
)

from .views import (
    CognoDBTestAPIView,
    DeveloperListAPIView,
    DeveloperDetailAPIView,
    ProjectRecommendationAPIView,
    ProjectListAPIView,
    SkillListAPIView,
    TechnologyListAPIView
)


urlpatterns = [

    path(
        "cognodb-test/",
        CognoDBTestAPIView.as_view(),
        name="cognodb-test"
    ),

    path(
        "developers/",
        DeveloperListAPIView.as_view(),
        name="developer-list"
    ),

    path(
        "developers/<str:email>/",
        DeveloperDetailAPIView.as_view(),
        name="developer-detail"
    ),

    path(
        "developers/<str:email>/recommendations/",
        ProjectRecommendationAPIView.as_view(),
        name="project-recommendations"
    ),

    path(
        "projects/",
        ProjectListAPIView.as_view(),
        name="project-list"
    ),

    path(
        "skills/",
        SkillListAPIView.as_view(),
        name="skill-list"
    ),

    path(
        "technologies/",
        TechnologyListAPIView.as_view(),
        name="technology-list"
    ),

    path(
        "graph/",
        GraphApiView.as_view(),
        name="graph-api"
    ),

    path(
        "developers/<str:developer_id>/graph/",
        DeveloperGraphApiView.as_view(),
        name="developer-graph"
    ),

    path(
        "developers/<str:developer_id>/profile/",
        DeveloperProfileApiView.as_view(),
        name="developer-profile"
    ),
]