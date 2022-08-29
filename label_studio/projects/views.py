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

token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoie1wiSWRcIjpcIjRmODQ3YjFlLWVhOTMtNGFhMS05MTBkLTAwZjQyMmQ2NDRlM1wiLFwiVXNlck5hbWVcIjpcImFkbWluXCIsXCJFbWFpbFwiOm51bGwsXCJGdWxsTmFtZVwiOlwiQWRtaW4gQWRtaW5cIixcIkZpcnN0TmFtZVwiOlwiQWRtaW5cIixcIkxhc3ROYW1lXCI6XCJBZG1pblwiLFwiUGhvbmVOdW1iZXJcIjpcIm51bGxcIixcIlN0YXR1c1wiOjMsXCJDcmVhdGVkQnlcIjpudWxsLFwiQ3JlYXRlZERhdGVcIjpcIjAwMDEtMDEtMDFUMDA6MDA6MDBcIixcIlJlZ2lzdHJhdGlvbkRhdGVcIjpudWxsLFwiTGFzdFZpc2l0RGF0ZVwiOm51bGwsXCJMYXN0UmVzZXREYXRlXCI6bnVsbCxcIlJvbGVcIjpbXCJTdXBlciBBZG1pblwiLFwiUHJvamVjdCBPd25lclwiLFwiTW9kdWxlIE93bmVyXCJdLFwiQXZhdGFyXCI6bnVsbCxcIlBlcm1pc3Npb25zXCI6W1wiVXNlcnNNYW5hZ2VtZW50LkNyZWF0ZVwiLFwiVXNlcnNNYW5hZ2VtZW50LlZpZXdcIixcIlVzZXJzTWFuYWdlbWVudC5VcGRhdGVcIixcIlVzZXJzTWFuYWdlbWVudC5VcGRhdGVTdGF0dXNcIixcIlVzZXJzTWFuYWdlbWVudC5SZW1vdmVcIixcIlVzZXJzTWFuYWdlbWVudC5HcmFudEFSb2xlXCIsXCJVc2Vyc01hbmFnZW1lbnQuR3JhbnRNQ1JvbGVcIixcIlVzZXJzTWFuYWdlbWVudC5HcmFudE1PUm9sZVwiLFwiVXNlcnNNYW5hZ2VtZW50LkdyYW50UENSb2xlXCIsXCJVc2Vyc01hbmFnZW1lbnQuR3JhbnRQT1JvbGVcIixcIlVzZXJSb2xlc01hbmFnZW1lbnQuQ3JlYXRlXCIsXCJVc2VyUm9sZXNNYW5hZ2VtZW50LlZpZXdcIixcIlVzZXJSb2xlc01hbmFnZW1lbnQuVXBkYXRlXCIsXCJVc2VyUm9sZXNNYW5hZ2VtZW50LlVwZGF0ZVN0YXR1c1wiLFwiQXR0cmlidXRlc01hbmFnZW1lbnQuQ3JlYXRlXCIsXCJBdHRyaWJ1dGVzTWFuYWdlbWVudC5WaWV3XCIsXCJBdHRyaWJ1dGVzTWFuYWdlbWVudC5VcGRhdGVcIixcIkF0dHJpYnV0ZXNNYW5hZ2VtZW50LlVwZGF0ZVN0YXR1c1wiLFwiQXR0cmlidXRlc01hbmFnZW1lbnQuUmVtb3ZlXCIsXCJNb2R1bGVzTWFuYWdlbWVudC5DcmVhdGVcIixcIk1vZHVsZXNNYW5hZ2VtZW50LlZpZXdBbGxcIixcIk1vZHVsZXNNYW5hZ2VtZW50LlZpZXdBc3NpZ25lZFwiLFwiTW9kdWxlc01hbmFnZW1lbnQuVXBkYXRlXCIsXCJNb2R1bGVzTWFuYWdlbWVudC5VcGRhdGVTdGF0dXNcIixcIk1vZHVsZXNNYW5hZ2VtZW50LlJlbW92ZVwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LkNyZWF0ZVwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LlZpZXdBbGxcIixcIlByb2plY3RzTWFuYWdlbWVudC5WaWV3TW9kdWxlUHJvamVjdFwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LlZpZXdBc3NpZ25lZFwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LlVwZGF0ZVwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LlVwZGF0ZVN0YXR1c1wiLFwiUHJvamVjdHNNYW5hZ2VtZW50LlJlbW92ZVwiLFwiUHJvamVjdHNNYW5hZ2VtZW50LkV4cG9ydFZlcnNpb25cIixcIkRhdGFzZXRNYW5hZ2VtZW50LlVwbG9hZFwiLFwiRGF0YXNldE1hbmFnZW1lbnQuRG93bmxvYWRcIixcIkRhdGFzZXRNYW5hZ2VtZW50LlVwZGF0ZVwiLFwiRGlzY3Vzc2lvbi5Xcml0ZUNvbW1lbnRcIixcIkRpc2N1c3Npb24uVmlld0xpc3RcIixcIkNvbmZpZ3VyYXRpb24uU3lzdGVtQ29uZmlndXJhdGlvblwiXSxcIkhhc1JvbGVTdXBwZXJBZG1pblwiOmZhbHNlLFwiQWRkcmVzc1wiOlwibnVsbFwiLFwiT3JnYW5pemF0aW9uXCI6XCJudWxsXCIsXCJEZXNjcmlwdGlvblwiOlwibnVsbFwifSIsImV4cCI6MTY2MTc3NTQ2M30.7sY4k0xL5-X0WEjyuPDwJK7PLLzfLciyoXkquMwU_HU'


@api_view(['GET'])
@login_required
def module_roles(request):
    req = requests.get(settings.DMS_API + '/modules/create', headers={'Authorization': token})
    res = req.json()
    print(res)
    return Response(res, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def module_search_members(request):
    data = {
        "start": 1,
        "length": 20,
        "keyword": "",
        "column": "CreatedAt",
        "direction": "desc"
    }
    req = requests.post(settings.DMS_API + '/modules/create/search-member', json=data, headers={'Authorization': token})
    res = req.json()
    print(res)
    return Response(res, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@login_required
def module_list(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        name = body['name']
        print('body_unicode', body_unicode)
        print('body', body)
        print('name', name)
        # avatar = request.POST['avatar']
        # avatarName = request.POST['avatarName']
        # description = request.POST['description']
        # statusModule = request.POST['status']
        # memberRoles = request.POST.getlist['memberRoles']
        data = {
            "name": name,
            # "avatar": avatar,
            # "avatarName": avatarName,
            # "description": description,
            # "status": statusModule,
            # "memberRoles": [
            #     {
            #     "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            #     "roleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            #     }
            # ]
        }
        req = requests.post(settings.DMS_API + '/modules/create', json=data, headers={'Authorization': token})
        res = req.json()
        print(res)
        return Response(res, status=status.HTTP_200_OK)
    elif request.method == 'GET':
        data = {
            "start": 1,
            "length": 20,
            "keyword": "",
            "column": "CreatedAt",
            "direction": ""
        }
        req = requests.post(settings.DMS_API + '/modules', json=data, headers={'Authorization': token})
        res = req.json()
        # print(res)
        return Response(res, status=status.HTTP_200_OK)
    

@api_view(['GET', 'PATCH', 'DELETE'])
@login_required
def module_detail(request, pk):
    if request.method == 'DELETE':
        req = requests.delete(settings.DMS_API + '/modules/'+pk+'/delete', headers={'Authorization': token})
        res = req.json()
        print(res)
        return Response(res, status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        name = body['name']
        print('body_unicode', body_unicode)
        print('body', body)
        print('name', name)

        data = {
            "name": name,
            # "avatar": avatar,
            # "avatarName": avatarName,
            # "description": description,
            # "status": statusModule,
            # "memberRoles": [
            #     {
            #     "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            #     "roleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            #     }
            # ]
        }
        req = requests.put(settings.DMS_API + '/modules/create', json=data, headers={'Authorization': token})
        res = req.json()
        print(res)
        return Response(res, status=status.HTTP_200_OK)
    elif request.method == 'GET':
        req = requests.get(settings.DMS_API + '/modules/'+pk+'/details', headers={'Authorization': token})
        res = req.json()
        print(res)
        return Response(res, status=status.HTTP_200_OK)


@login_required
def project_list(request):
    return render(request, 'projects/list.html')


@login_required
def project_settings(request, pk, sub_path):
    print('da vao')
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
