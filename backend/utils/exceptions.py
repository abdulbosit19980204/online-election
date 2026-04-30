from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        if isinstance(response.data, dict) and "detail" not in response.data:
            # Reformat to simple format { "detail": "..." } if it's field errors
            errors = []
            for k, v in response.data.items():
                if isinstance(v, list):
                    errors.append(f"{k}: {v[0]}")
                else:
                    errors.append(f"{k}: {v}")
            response.data = {"detail": " | ".join(errors)}
    return response
