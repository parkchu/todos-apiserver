# Generated by Django 3.0.3 on 2020-03-19 12:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('APIServer', '0003_auto_20200319_2145'),
    ]

    operations = [
        migrations.RenameField(
            model_name='todos',
            old_name='todoid',
            new_name='todo_id',
        ),
    ]
