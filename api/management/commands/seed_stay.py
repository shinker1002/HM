from django.core.management.base import BaseCommand
from django_seed import Seed
from api.models import Stay
from faker import Faker

class Command(BaseCommand):
    def handle(self, *args, **options):
        f = Faker()
        seeder = Seed.seeder()

        for _ in range(350):
            seeder.add_entity(Stay, 1,
                {
                    "place": "종합강의동",
                    # "dateTime": f.date_time_between('-2years','now'),
                    "dateTime": f.date_time_between('-1days','now'),
                    "inout": 1,
                }
            )
        seeder.execute()
    