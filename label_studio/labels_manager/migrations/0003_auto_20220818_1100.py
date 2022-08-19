# Generated by Django 3.2.14 on 2022-08-18 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labels_manager', '0002_auto_20220131_1325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='label',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, help_text='Time of label modification', verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='label',
            name='value',
            field=models.JSONField(help_text='Label value', verbose_name='value'),
        ),
        migrations.AlterField(
            model_name='labellink',
            name='from_name',
            field=models.CharField(help_text='Tag name', max_length=2048, verbose_name='Tag name'),
        ),
    ]
