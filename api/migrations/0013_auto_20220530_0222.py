# Generated by Django 3.1.3 on 2022-05-29 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20220522_1805'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stay',
            name='dateTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]