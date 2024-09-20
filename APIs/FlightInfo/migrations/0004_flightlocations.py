# Generated by Django 5.0.2 on 2024-05-25 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FlightInfo', '0003_alter_flights_flight_duration'),
    ]

    operations = [
        migrations.CreateModel(
            name='FlightLocations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
            ],
            options={
                'unique_together': {('country', 'city')},
            },
        ),
    ]