# Generated by Django 3.1.3 on 2022-05-02 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='passward',
            field=models.TextField(),
        ),
    ]
