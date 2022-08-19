"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import json
import logging
import lxml.etree
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from projects.models import Project

from core.utils.common import get_object_with_check_and_log
from core.label_config import get_sample_task
from core.utils.common import get_organization_from_request

from organizations.models import Organization

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


@api_view(['GET'])
@login_required
def module_list(request):
    data = {
        "start": 1,
        "length": 20,
        "keyword": "",
        "column": "CreatedAt",
        "direction": ""
    }
    req = requests.post(settings.DMS_API + '/modules', json=data, headers={'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoie1wiSWRcIjpcIjRmODQ3YjFlLWVhOTMtNGFhMS05MTBkLTAwZjQyMmQ2NDRlM1wiLFwiVXNlck5hbWVcIjpcImFkbWluXCIsXCJFbWFpbFwiOm51bGwsXCJGdWxsTmFtZVwiOlwiQWRtaW4gQWRtaW5cIixcIkZpcnN0TmFtZVwiOlwiQWRtaW5cIixcIkxhc3ROYW1lXCI6XCJBZG1pblwiLFwiUGhvbmVOdW1iZXJcIjpudWxsLFwiU3RhdHVzXCI6MyxcIkNyZWF0ZWRCeVwiOm51bGwsXCJDcmVhdGVkRGF0ZVwiOlwiMDAwMS0wMS0wMVQwMDowMDowMFwiLFwiUmVnaXN0cmF0aW9uRGF0ZVwiOm51bGwsXCJMYXN0VmlzaXREYXRlXCI6bnVsbCxcIkxhc3RSZXNldERhdGVcIjpudWxsLFwiUm9sZVwiOltcIlN1cGVyIEFkbWluXCIsXCJQcm9qZWN0IE93bmVyXCIsXCJNb2R1bGUgT3duZXJcIl0sXCJBdmF0YXJcIjpudWxsLFwiUGVybWlzc2lvbnNcIjpbXCJVc2Vyc01hbmFnZW1lbnQuQ3JlYXRlXCIsXCJVc2Vyc01hbmFnZW1lbnQuVmlld1wiLFwiVXNlcnNNYW5hZ2VtZW50LlVwZGF0ZVwiLFwiVXNlcnNNYW5hZ2VtZW50LlVwZGF0ZVN0YXR1c1wiLFwiVXNlcnNNYW5hZ2VtZW50LlJlbW92ZVwiLFwiVXNlcnNNYW5hZ2VtZW50LkdyYW50QVJvbGVcIixcIlVzZXJzTWFuYWdlbWVudC5HcmFudE1DUm9sZVwiLFwiVXNlcnNNYW5hZ2VtZW50LkdyYW50TU9Sb2xlXCIsXCJVc2Vyc01hbmFnZW1lbnQuR3JhbnRQQ1JvbGVcIixcIlVzZXJzTWFuYWdlbWVudC5HcmFudFBPUm9sZVwiLFwiVXNlclJvbGVzTWFuYWdlbWVudC5DcmVhdGVcIixcIlVzZXJSb2xlc01hbmFnZW1lbnQuVmlld1wiLFwiVXNlclJvbGVzTWFuYWdlbWVudC5VcGRhdGVcIixcIlVzZXJSb2xlc01hbmFnZW1lbnQuVXBkYXRlU3RhdHVzXCIsXCJBdHRyaWJ1dGVzTWFuYWdlbWVudC5DcmVhdGVcIixcIkF0dHJpYnV0ZXNNYW5hZ2VtZW50LlZpZXdcIixcIkF0dHJpYnV0ZXNNYW5hZ2VtZW50LlVwZGF0ZVwiLFwiQXR0cmlidXRlc01hbmFnZW1lbnQuVXBkYXRlU3RhdHVzXCIsXCJBdHRyaWJ1dGVzTWFuYWdlbWVudC5SZW1vdmVcIixcIk1vZHVsZXNNYW5hZ2VtZW50LkNyZWF0ZVwiLFwiTW9kdWxlc01hbmFnZW1lbnQuVmlld0FsbFwiLFwiTW9kdWxlc01hbmFnZW1lbnQuVmlld0Fzc2lnbmVkXCIsXCJNb2R1bGVzTWFuYWdlbWVudC5VcGRhdGVcIixcIk1vZHVsZXNNYW5hZ2VtZW50LlVwZGF0ZVN0YXR1c1wiLFwiTW9kdWxlc01hbmFnZW1lbnQuUmVtb3ZlXCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuQ3JlYXRlXCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuVmlld0FsbFwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LlZpZXdNb2R1bGVQcm9qZWN0XCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuVmlld0Fzc2lnbmVkXCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuVXBkYXRlXCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuVXBkYXRlU3RhdHVzXCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuUmVtb3ZlXCIsXCJQcm9qZWN0c01hbmFnZW1lbnQuRXhwb3J0VmVyc2lvblwiLFwiRGF0YXNldE1hbmFnZW1lbnQuVXBsb2FkXCIsXCJEYXRhc2V0TWFuYWdlbWVudC5Eb3dubG9hZFwiLFwiRGF0YXNldE1hbmFnZW1lbnQuVXBkYXRlXCIsXCJEaXNjdXNzaW9uLldyaXRlQ29tbWVudFwiLFwiRGlzY3Vzc2lvbi5WaWV3TGlzdFwiLFwiQ29uZmlndXJhdGlvbi5TeXN0ZW1Db25maWd1cmF0aW9uXCJdLFwiSGFzUm9sZVN1cHBlckFkbWluXCI6ZmFsc2UsXCJBZGRyZXNzXCI6bnVsbCxcIk9yZ2FuaXphdGlvblwiOm51bGwsXCJEZXNjcmlwdGlvblwiOm51bGx9IiwiZXhwIjoxNjYwOTAzNDQ2fQ.ilmPeL0g6UWJIk_FAab_VLqxOWvwbGpwvxBXqoFnS4U'})
    res = req.json()
    print(res)
    return Response(res, status=status.HTTP_200_OK)

@login_required
def project_list(request):
    return render(request, 'projects/list.html')


@login_required
def project_settings(request, pk, sub_path):
    return render(request, 'projects/settings.html')


def playground_replacements(request, task_data):
    if request.GET.get('playground', '0') == '1':
        for key in task_data:
            if "/samples/time-series.csv" in task_data[key]:
                task_data[key] = "https://app.heartex.ai" + task_data[key]
    return task_data


@require_http_methods(['GET', 'POST'])
def upload_example_using_config(request):
    """ Generate upload data example by config only
    """
    config = request.GET.get('label_config', '')
    if not config:
        config = request.POST.get('label_config', '')

    org_pk = get_organization_from_request(request)
    secure_mode = False
    if org_pk is not None:
        org = get_object_with_check_and_log(request, Organization, pk=org_pk)
        secure_mode = org.secure_mode

    try:
        Project.validate_label_config(config)
        task_data, _, _ = get_sample_task(config, secure_mode)
        task_data = playground_replacements(request, task_data)
    except (ValueError, ValidationError, lxml.etree.Error):
        response = HttpResponse('error while example generating', status=status.HTTP_400_BAD_REQUEST)
    else:
        response = HttpResponse(json.dumps(task_data))
    return response
