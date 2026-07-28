from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from owners.models import OwnerProfile

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name=_('Name'))
    icon = models.CharField(max_length=255, blank=True, null=True, verbose_name=_('Icon Class/URL'))

    class Meta:
        verbose_name = _('Amenity')
        verbose_name_plural = _('Amenities')
        ordering = ['name']

    def __str__(self):
        return self.name

class PGListing(models.Model):
    class GenderChoices(models.TextChoices):
        BOYS = 'boys', _('Boys')
        GIRLS = 'girls', _('Girls')
        COED = 'coed', _('Co-Ed')

    owner = models.ForeignKey(
        OwnerProfile, 
        on_delete=models.CASCADE, 
        related_name='pgs',
        verbose_name=_('Owner')
    )
    name = models.CharField(max_length=255, verbose_name=_('PG Name'))
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name=_('Slug'))
    description = models.TextField(verbose_name=_('Description'))
    gender_type = models.CharField(
        max_length=10, 
        choices=GenderChoices.choices,
        verbose_name=_('Gender Type')
    )
    address = models.TextField(verbose_name=_('Address'))
    city = models.CharField(max_length=100, db_index=True, verbose_name=_('City'))
    state = models.CharField(max_length=100, db_index=True, verbose_name=_('State'))
    zip_code = models.CharField(max_length=20, verbose_name=_('Zip Code'))
    
    latitude = models.DecimalField(
        max_digits=9, 
        decimal_places=6, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)],
        verbose_name=_('Latitude')
    )
    longitude = models.DecimalField(
        max_digits=10, 
        decimal_places=6, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)],
        verbose_name=_('Longitude')
    )
    
    house_rules = models.TextField(blank=True, null=True, verbose_name=_('House Rules'))
    amenities = models.ManyToManyField(
        Amenity, 
        related_name='pgs',
        verbose_name=_('Amenities'),
        blank=True
    )
    is_approved = models.BooleanField(default=False, verbose_name=_('Is Approved'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        verbose_name = _('PG Listing')
        verbose_name_plural = _('PG Listings')
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Room(models.Model):
    pg = models.ForeignKey(
        PGListing, 
        on_delete=models.CASCADE, 
        related_name='rooms',
        verbose_name=_('PG Listing')
    )
    sharing_type = models.PositiveIntegerField(
        help_text=_("e.g., 1 for single, 2 for double sharing"),
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name=_('Sharing Type')
    )
    price_per_month = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.0)],
        verbose_name=_('Price Per Month')
    )
    deposit_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.0)],
        verbose_name=_('Deposit Amount')
    )
    total_beds = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name=_('Total Beds')
    )
    available_beds = models.PositiveIntegerField(
        validators=[MinValueValidator(0)],
        verbose_name=_('Available Beds')
    )

    class Meta:
        verbose_name = _('Room')
        verbose_name_plural = _('Rooms')
        ordering = ['pg', 'sharing_type']
        unique_together = ('pg', 'sharing_type')

    def __str__(self):
        return f"{self.sharing_type} Sharing in {self.pg.name}"

class PGImage(models.Model):
    pg = models.ForeignKey(
        PGListing, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name=_('PG Listing')
    )
    image = models.ImageField(
        upload_to='pg_images/',
        verbose_name=_('Image')
    )
    is_primary = models.BooleanField(
        default=False,
        verbose_name=_('Is Primary')
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Uploaded At')
    )

    class Meta:
        verbose_name = _('PG Image')
        verbose_name_plural = _('PG Images')
        ordering = ['-is_primary', '-uploaded_at']

    def __str__(self):
        return f"Image for {self.pg.name}"
