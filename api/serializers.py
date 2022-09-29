from calendar import month
from rest_framework import serializers
from .models import Users, Stay

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['api_id','email','password']

# 테스트 데이터를 위함
class StaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Stay
        fields = [ "place","inout" ]


