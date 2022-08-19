# Generated by Django 3.2.14 on 2022-08-18 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webhooks', '0002_auto_20220319_0013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webhookaction',
            name='action',
            field=models.CharField(choices=[['PROJECT_CREATED', 'Project created'], ['PROJECT_UPDATED', 'Project updated'], ['PROJECT_DELETED', 'Project deleted'], ['TASKS_CREATED', 'Task created'], ['TASKS_DELETED', 'Task deleted'], ['ANNOTATION_CREATED', 'Annotation created'], ['ANNOTATIONS_CREATED', 'Annotations created'], ['ANNOTATION_UPDATED', 'Annotation updated'], ['ANNOTATIONS_DELETED', 'Annotation deleted'], ['LABEL_LINK_CREATED', 'Label link created'], ['LABEL_LINK_UPDATED', 'Label link updated'], ['LABEL_LINK_DELETED', 'Label link deleted']], db_index=True, help_text='Action value', max_length=128, verbose_name='action of webhook'),
        ),
    ]
