"use client";

import { useState, type FormEvent } from "react";
import {
    Button,
    FieldError,
    Input,
    Label,
    ListBox,
    Select,
    TextArea,
    TextField,
    Calendar,
    DateField,
    DatePicker,
    toast,
} from "@heroui/react";
import { today, getLocalTimeZone, type CalendarDate } from "@internationalized/date";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const eventTypes = [
    "Cleanup",
    "Plantation",
    "Donation",
    "Community Service",
    "Education",
    "Healthcare",
    "Other",
];

export default function CreateEventPage() {
    const [eventType, setEventType] = useState("Cleanup");
    const [eventDate, setEventDate] = useState<CalendarDate | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const { data } = useSession();
    const { id: userId, email, name } = data?.user || {}
    const router = useRouter();

    const minDate = today(getLocalTimeZone());

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!eventDate) {
            setDateError("Please select an event date.");
            return;
        }

        if (eventDate.compare(minDate) < 0) {
            setDateError("Event date cannot be in the past.");
            return;
        }

        setDateError(null);

        const formData = new FormData(e.currentTarget);

        const eventData = {
            title: formData.get("title"),
            description: formData.get("description"),
            eventType,
            thumbnailUrl: formData.get("thumbnailUrl"),
            location: formData.get("location"),
            eventDate: eventDate.toString(),
        };
        try {
            const finalEventData = { ...eventData, userId, email, name }
            console.log(finalEventData);

            const res = await fetch("http://localhost:5000/events/create", {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(finalEventData)
            })
            if (res.ok) {
                toast.success("Event created successfully")
                // handleReset();
                router.push("/events");
            }
        } catch (error) {
            console.log(error)
            toast.danger("Failed to create event");
        }
    };

    const handleReset = () => {
        setEventType("Cleanup");
        setEventDate(null);
        setDateError(null);
    };

    return (
        <section className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Page Heading */}
                <div className="mb-10 text-center">
                    <h1 className="mb-3">Create an Event</h1>
                    <p className="mx-auto max-w-xl text-muted">
                        Bring your community together. Create an event and make a
                        meaningful difference in people's lives.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-6">
                        {/* Event Title */}
                        <TextField name="title" isRequired className="w-full">
                            <Label>Event Title</Label>
                            <Input
                                placeholder="e.g. Winter Clothes Distribution"
                                className="w-full"
                            />
                        </TextField>

                        {/* Description */}
                        <TextField name="description" isRequired className="w-full">
                            <Label>Event Description</Label>
                            <TextArea
                                placeholder="Describe the purpose and details of your event..."
                                className="min-h-32 w-full resize-y border border-border"
                            />
                        </TextField>

                        {/* Event Type */}
                        <div className="space-y-2">
                            <Label>Event Type</Label>

                            <Select
                                name="eventType"
                                value={eventType}
                                onChange={(value) => setEventType(String(value))}
                                className="w-full border border-border rounded-xl"
                                placeholder="Select an event type"
                            >
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>

                                <Select.Popover>
                                    <ListBox>
                                        {eventTypes.map((type) => (
                                            <ListBox.Item key={type} id={type} textValue={type}>
                                                {type}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        {/* Thumbnail URL */}
                        <TextField name="thumbnailUrl" isRequired className="w-full">
                            <Label>Thumbnail Image URL</Label>
                            <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="w-full"
                            />
                        </TextField>

                        {/* Location */}
                        <TextField name="location" isRequired className="w-full">
                            <Label>Event Location</Label>
                            <Input
                                placeholder="e.g. Mirpur 10, Dhaka"
                                className="w-full"
                            />
                        </TextField>

                        {/* Event Date */}
                        <div className="space-y-2">
                            <Label isRequired>Event Date</Label>

                            <DatePicker
                                className="w-full border border-border rounded-xl"
                                name="eventDate"
                                isRequired
                                isInvalid={Boolean(dateError)}
                                minValue={minDate}
                                value={eventDate}
                                onChange={(value) => {
                                    setEventDate(value);
                                    setDateError(null);
                                }}
                            >
                                <DateField.Group fullWidth>
                                    <DateField.Input>
                                        {(segment) => (
                                            <DateField.Segment segment={segment} />
                                        )}
                                    </DateField.Input>

                                    <DateField.Suffix>
                                        <DatePicker.Trigger>
                                            <DatePicker.TriggerIndicator />
                                        </DatePicker.Trigger>
                                    </DateField.Suffix>
                                </DateField.Group>

                                <FieldError>{dateError}</FieldError>

                                <DatePicker.Popover>
                                    <Calendar aria-label="Event date">
                                        <Calendar.Header>
                                            <Calendar.YearPickerTrigger>
                                                <Calendar.YearPickerTriggerHeading />
                                                <Calendar.YearPickerTriggerIndicator />
                                            </Calendar.YearPickerTrigger>

                                            <Calendar.NavButton slot="previous" />
                                            <Calendar.NavButton slot="next" />
                                        </Calendar.Header>

                                        <Calendar.Grid>
                                            <Calendar.GridHeader>
                                                {(day) => (
                                                    <Calendar.HeaderCell>
                                                        {day}
                                                    </Calendar.HeaderCell>
                                                )}
                                            </Calendar.GridHeader>

                                            <Calendar.GridBody>
                                                {(date) => <Calendar.Cell date={date} />}
                                            </Calendar.GridBody>
                                        </Calendar.Grid>

                                        <Calendar.YearPickerGrid>
                                            <Calendar.YearPickerGridBody>
                                                {({ year }) => (
                                                    <Calendar.YearPickerCell year={year} />
                                                )}
                                            </Calendar.YearPickerGridBody>
                                        </Calendar.YearPickerGrid>
                                    </Calendar>
                                </DatePicker.Popover>
                            </DatePicker>

                            <p className="text-sm text-muted">
                                You can only select today or a future date.
                            </p>
                        </div>

                        <div className="text-sm">
                            Attached email: <span className="text-accent">{email}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                            <Button
                                type="reset"
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                className="w-full text-background sm:w-auto"
                            >
                                Create Event
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}