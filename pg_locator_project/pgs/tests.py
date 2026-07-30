from django.test import TestCase
from django.contrib.auth import get_user_model
from owners.models import OwnerProfile
from pgs.models import PGListing

User = get_user_model()

class PGListingModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testowner',
            email='testowner@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='Owner',
            role=User.RoleChoices.OWNER
        )
        self.owner_profile = OwnerProfile.objects.create(
            user=self.user,
            phone_number='+1234567890'
        )
        self.pg = PGListing.objects.create(
            owner=self.owner_profile,
            name='Test PG',
            description='A test PG listing',
            gender_type=PGListing.GenderChoices.COED,
            address='123 Test St',
            city='Bangalore',
            state='Karnataka',
            zip_code='560001'
        )

    def test_pg_creation(self):
        self.assertEqual(self.pg.name, 'Test PG')
        self.assertFalse(self.pg.is_approved)
        self.assertEqual(self.pg.city, 'Bangalore')

    def test_pg_slug_generation(self):
        self.assertEqual(self.pg.slug, 'test-pg')
