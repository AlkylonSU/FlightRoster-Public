# Generated by Django 5.0.2 on 2024-05-06 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FlightInfo', '0002_flights_shared_flight'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flights',
            name='flight_duration',
            field=models.DurationField(),
        ),
    ]