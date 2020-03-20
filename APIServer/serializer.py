from rest_framework import serializers
from .models import ToDos

class ToDosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDos
        fields = ('text', 'todo_id', 'finish')
